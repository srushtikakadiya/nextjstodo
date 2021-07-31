import { useState } from 'react';
import dbConnect from '../utils/dbConnect';
import Todo from '../utils/models/Todo';

import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import Checkbox from '@material-ui/core/Checkbox';
import DeleteForeverRoundedIcon from '@material-ui/icons/DeleteForeverRounded';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import { addTodo, completeTodo, deleteTodo } from '../utils';

export default function TodoApp({ todos }) {
  const [inputs, setInputs] = useState({
    task: '',
  });

  const handleInputs = (event) => {
    event.persist();
    setInputs(() => ({
      [event.target.id]: event.target.value,
    }));
  };

  const handleAddTodo = async (event) => {
    event.preventDefault();
    await addTodo(inputs);
    setInputs(() => ({
      task: '',
    }));
  };

  const handleCompleteTodo = async (_id, status) => {
    await completeTodo(_id, !status);
  };

  const handleDeleteTodo = async (_id) => {
    await deleteTodo(_id);
  };

  return (
    <Container maxWidth="sm">
      <form onSubmit={handleAddTodo}>
        <TextField
          id="task"
          value={inputs.task}
          label="+ Add todo"
          margin="normal"
          fullWidth
          variant="outlined"
          onChange={handleInputs}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={inputs.task ? false : true}
        >
          Submit
        </Button>
      </form>
      <List>
        {todos.map(({ _id, task, isCompleted }) => {
          return (
            <ListItem
              key={_id}
              role={undefined}
              button
              divider
              onClick={() => {
                handleCompleteTodo(_id, isCompleted);
              }}
            >
              <ListItemIcon>
                <Checkbox checked={isCompleted} />
              </ListItemIcon>
              <ListItemText
                id={_id}
                primary={task}
                style={{
                  textDecoration: isCompleted ? 'line-through' : 'none',
                }}
              />
              <ListItemSecondaryAction
                onClick={() => {
                  handleDeleteTodo(_id);
                }}
              >
                <IconButton edge="end">
                  <DeleteForeverRoundedIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          );
        })}
      </List>
    </Container>
  );
}

export async function getServerSideProps() {
  await dbConnect();
  const data = await Todo.find();

  const todos = data.map((doc) => {
    const todo = doc.toObject();
    todo._id = todo._id.toString();
    todo.created = todo.created.toString();
    todo.updated = todo.updated.toString();
    return todo;
  });

  return {
    props: {
      todos,
    },
  };
}
