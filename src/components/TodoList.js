import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const TodoList = () => {
  const [userTodos, setUserTodos] = useState([]);
  const navigate = useNavigate();

  const location = useLocation();
  const { state } = location;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 실제 날짜 객체를 사용하여 formatDate 함수 호출
        const formattedDate = formatDate(state.date);
        const todosResponse = await axios.get(`http://localhost:8000/api/todo/?date=${formattedDate}`);
        setUserTodos(todosResponse.data);
      } catch (error) {
        console.error('데이터 가져오는 중 에러 발생:', error);
      }
    };

    fetchData();
  }, [state.date]);  // state.date가 변경될 때마다 useEffect 실행

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  };
  

  const handleUserClick = (userId) => {
    // 사용자의 Todo 리스트를 보여주는 페이지로 이동
    navigate(`/user-todo/${userId}`);
  };

  return (
    <div>
      <h1>{state && state.date ? `Todo List for ${formatDate(state.date)}` : 'Todo List'}</h1>
      {userTodos.length === 0 ? (
        <p>Todo가 없습니다.</p>
        ) : (
        userTodos.map((todo) => (
          <div
            key={todo.todo_id}
            style={{ border: `2px solid ${todo.user_color}`, padding: '10px', marginBottom: '10px', cursor: 'pointer' }}
            onClick={() => handleUserClick(todo.user_id)}
          >
            <h2>{todo.user_name}'s Todo</h2>
            <ul>
              <li key={todo.todo_id}>{todo.todo_content}</li>
            </ul>
          </div>
        ))
      )}
      <Link to="/">홈으로 돌아가기</Link>
    </div>
  );
};

export default TodoList;