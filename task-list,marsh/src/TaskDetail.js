import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './App.module.css';

const TaskDetail = ({ onDelete }) => {
	const { id } = useParams();
	const [task, setTask] = useState(null);
	const navigate = useNavigate();

	useEffect(() => {
		fetch(`http://localhost:3005/task/${id}`)
			.then((response) => {
				if (!response.ok) {
					navigate('/404');
					return;
				}
				return response.json();
			})
			.then((data) => {
				if (data) {
					setTask(data);
				}
			})
			.catch((error) => {
				console.error('Ошибка загрузки задачи:', error);
				navigate('/404');
			});
	}, [id, navigate]);

	const handleDelete = () => {
		fetch(`http://localhost:3005/task/${id}`, {
			method: 'DELETE',
		})
			.then(() => {
				onDelete(id); // Уведомляем родительский компонент
				navigate('/'); // Возврат на главную страницу после удаления
			})
			.catch((error) => {
				console.error('Ошибка удаления задачи:', error);
			});
	};

	const handleEdit = (updatedTitle) => {
		fetch(`http://localhost:3005/task/${id}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json;charset=utf-8' },
			body: JSON.stringify({ title: updatedTitle }),
		})
			.then((response) => response.json())
			.then((updatedTask) => {
				setTask(updatedTask);
			})
			.catch((error) => {
				console.error('Ошибка изменения задачи:', error);
			});
	};

	if (!task) return <div>Загрузка...</div>;

	return (
		<div className={styles.taskDetail}>
			<button onClick={() => navigate(-1)}>&lt; Назад</button>
			<h1>Задача: {task.title}</h1>
			<button onClick={handleDelete}>Удалить</button>
			<button
				onClick={() =>
					handleEdit(prompt('Введите новое название задачи:', task.title))
				}
			>
				Изменить
			</button>
		</div>
	);
};

export default TaskDetail;
