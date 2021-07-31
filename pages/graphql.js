import gql from 'graphql-tag';
import { useMutation, useQuery } from '@apollo/client';
import { initializeApollo } from '../apollo/client';

const TODOS_QUERY = gql`
  query TodoQuery {
    todos {
      _id
      task
    }
  }
`;

const ADD_TODO_MUTATION = gql`
  mutation addTodo($task: String!, $isCompleted: Boolean!) {
    addTodo(task: $task, isCompleted: $isCompleted) {
      _id
      task
      isCompleted
    }
  }
`;

export default function GraphQL() {
  const {
    data: { todos },
  } = useQuery(TODOS_QUERY);
  const [add] = useMutation(ADD_TODO_MUTATION, {
    update(cache, { data: { addTodo } }) {
      const { todos } = cache.readQuery({ query: TODOS_QUERY });
      const newTodos = [...todos, addTodo];
      cache.writeQuery({
        query: TODOS_QUERY,
        data: { todos: newTodos },
      });
    },
  });

  const handleAddTodo = async (event) => {
    event.preventDefault();
    add({
      variables: {
        task: 'NEW CACHE TEST',
        isCompleted: false,
      },
    });
  };

  return (
    <div>
      <div>
        <form onSubmit={handleAddTodo}>
          <input type="text" name="todo" id="todo" />
          <button type="submit">add</button>
        </form>
      </div>
      {todos.map(({ _id, task }) => (
        <div key={_id}>todo: {task}</div>
      ))}
    </div>
  );
}

export async function getServerSideProps() {
  const apolloClient = initializeApollo();

  await apolloClient.query({
    query: TODOS_QUERY,
  });

  return {
    props: {
      initialApolloState: apolloClient.cache.extract(),
    },
  };
}
