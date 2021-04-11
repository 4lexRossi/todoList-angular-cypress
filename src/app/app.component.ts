import { Component, OnInit } from '@angular/core';
import {todomodel} from "./todomodel";
import { TodoService } from './todo.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'todolist';

  edited = false;

  mytodo = new todomodel(0,'',false);

  mytodolist:  todomodel [];


  constructor (private dataservice: TodoService) {
  }

  onSubmit() {
      this.saveTodo(this.mytodo);
      this.mytodo = new todomodel(0,'',false);
    }

  saveTodo(mytodo: todomodel){
    if (!this.edited) {
      if (this.mytodo.title=='') return;
        this.dataservice.createTodo(mytodo).subscribe(data=> {
          this.displayTodoList();
      });
    }
    else {
      this.edited=false;
      console.log('this is being edited',mytodo);
      this.dataservice.updateTodo(this.mytodo.id,this.mytodo).subscribe(data =>
        {
          this.displayTodoList();
        }
        );
    }
  }

  ngOnInit(){
    this.displayTodoList();
  }

  displayTodoList() {
    this.dataservice.getTodoList().subscribe(data =>
      {
        this.mytodolist = data.sort((a,b)=> {
          if (a.id>b.id) return -1;
          if (a.id<b.id) return 1;
        });
        console.log('display', this.mytodolist);
      });
  }
  Delete(id: number) {
    console.log('delete', id);
    this.dataservice.deleteTodo(id).subscribe(data =>{
        this.displayTodoList();
      });
  }
  Edit(eid: number) {
    console.log('editing',eid);
    this.mytodo = this.mytodolist.filter(x => x.id == eid)[0];
    this.edited = true;
  }

  FinishTodo(eid: number) {
    const mytodofinished = this.mytodolist.filter(x => x.id ==eid )[0];
    mytodofinished.completed =  !mytodofinished.completed ;
    this.dataservice.updateTodo(eid,mytodofinished).subscribe(data =>{
        this.displayTodoList();
      });
  }

}
