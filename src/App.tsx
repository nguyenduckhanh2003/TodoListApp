import { useEffect, useState } from 'react'
import './App.css'
import axios from 'axios'


function App() {
  const [task, setTask] = useState('');
  const [dataTask, setDataTask] = useState([])
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  // get data from file json
  useEffect(() => {
    const fetchAPI = async () => {
      try {
        const response = await axios.get('http://localhost:9999/tasks');
        setDataTask(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchAPI();
  }, [dataTask]);

  // filter data by status of task
  const filterData = dataTask.filter((item: any) => {
    let filterStatus;
    switch (filter) {
      case 'all':
        filterStatus = true;
        break;
      case 'true':
        filterStatus = item.completed === true;
        break;
      case 'false':
        filterStatus = item.completed === false;
        break;
      default:
    }
    console.log(filterStatus);
    return filterStatus;
  });


  //add a new task in the list
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (task.trim() === '') {
      setError('Task cannot be empty');
      return;
    }
    try {
      await axios.post('http://localhost:9999/tasks', { task: task, completed: false });
      setError('');
      setTask('');
    } catch (error) {
      setError('Error adding task. Please try again.');
      console.error('Error fetching data:', error);
    }
  };

  //delete a task in the list
  const handleDelete = async (id: any) => {
    const alert = window.confirm('Are you sure you want to delete this task?');
    if (!alert) {
      return;
    }
    try {
      await axios.delete(`http://localhost:9999/tasks/${id}`);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  //change status of task when the task completed
  const handleChangeStatus = async (id: any) => {
    try {
      await axios.patch(`http://localhost:9999/tasks/${id}`, { completed: true });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  return (
    <div className='container'>
      <div>
        <img src="https://png.pngtree.com/png-vector/20221121/ourmid/pngtree-cartoon-todo-list-icon-on-white-background-remember-page-agreement-vector-png-image_42056902.jpg" className="logo" alt="Todo logo" />
        <p className='title'>Check Todo List</p>
      </div>
      <div>
        <form onSubmit={handleSubmit} className='form'>
          <input
            type="text"
            placeholder=" Enter your task"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            className='input'
          />
          <button
            type="submit"
            className='btn'
          >
            Add
          </button>
        </form>
        {error && <p className='error'>{error}</p>}
        <div className='filter'>
          <select onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All</option>
            <option value="true">Completed</option>
            <option value="false">In Process</option>
          </select>
        </div>
        <div className='list'>
          <table>
            <thead>
              <th>Id</th>
              <th>Task</th>
              <th>Completed</th>
              <th>Action</th>
            </thead>
            <tbody>
              {
                filterData.map((task: any) => (
                  <tr key={task.id}>
                    <td>{task.id}</td>
                    <td>{task.task}</td>
                    <td style={{ color: task.completed ? 'rgb(3, 239, 3)' : 'yellow' }}>{task.completed ? 'Completed' : 'In Progress'}</td>
                    <td><button onClick={() => handleDelete(task.id)} >Delete</button>
                      {
                        task.completed ? (
                          <button>Change Status</button>
                        ) :
                          <button onClick={() => handleChangeStatus(task.id)}>Change Status</button>

                      }
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default App
