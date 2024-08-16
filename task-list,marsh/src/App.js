import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import styles from './App.module.css';
import TaskDetail from './TaskDetail';
import NotFound from './NotFound';

export const App = () => {
	const [taskList, setTaskList] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [task, setTask] = useState('');
	const [searchPhrase, setSearchPhrase] = useState('');
	const [sortAlphabetically, setSortAlphabetically] = useState(false);

	useEffect(() => {
		setIsLoading(true);
		fetch('http://localhost:3005/task')
			.then((loadedData) => loadedData.json())
			.then((loadedTask) => {
				setTaskList(loadedTask);
			})
			.catch((error) => {
				console.error('Ошибка загрузки задач:', error);
			})
			.finally(() => setIsLoading(false));
	}, []);

	const handleInputChange = (e) => {
		setTask(e.target.value);
	};

	const handleSearchInputChange = (e) => {
		setSearchPhrase(e.target.value);
	};

	const requestAddTask = () => {
		fetch('http://localhost:3005/task', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json;charset=utf-8' },
			body: JSON.stringify({ title: task }),
		})
			.then((rawResponse) => rawResponse.json())
			.then((newTask) => {
				setTaskList((prevList) => [...prevList, newTask]);
				setTask('');
			})
			.catch((error) => {
				console.error('Ошибка добавления задачи:', error);
			});
	};

	const filteredTasks = taskList.filter((task) =>
		task.title.toLowerCase().includes(searchPhrase.toLowerCase()),
	);

	const sortedTasks = sortAlphabetically
		? [...filteredTasks].sort((a, b) => a.title.localeCompare(b.title))
		: filteredTasks;

	const handleSortTasks = () => {
		setSortAlphabetically((prev) => !prev);
	};

	const handleDeleteTask = (id) => {
		setTaskList((prevList) => prevList.filter((task) => task.id !== id));
	};

	return (
		<Router>
			<div className={styles.app}>
				<form>
					<input
						name="task"
						type="text"
						placeholder="Введите новую задачу"
						value={task}
						onChange={handleInputChange}
					/>
					<button type="button" onClick={requestAddTask}>
						Добавить новую задачу
					</button>
				</form>
				<button onClick={handleSortTasks}>
					{sortAlphabetically
						? 'Сбросить сортировку'
						: 'Сортировать по алфавиту'}
				</button>
				<input
					type="text"
					placeholder="Поиск по задачам"
					value={searchPhrase}
					onChange={handleSearchInputChange}
				/>
				<ul className="taskList">
					{isLoading ? (
						<div className={styles.loader}></div>
					) : (
						sortedTasks.map(({ id, title }) => (
							<li key={id}>
								<Link to={`/task/${id}`}>
									<span title={title}>
										{title.length > 20
											? `${title.substring(0, 20)}...`
											: title}
									</span>
								</Link>
							</li>
						))
					)}
				</ul>

				<Routes>
					<Route
						path="/task/:id"
						element={<TaskDetail onDelete={handleDeleteTask} />}
					/>
					<Route path="/404" element={<NotFound />} />
					<Route
						path="/"
						element={
							<div>
								Здравствуйте! Используйте меню для управления задачами.
							</div>
						}
					/>
					<Route path="*" element={<NotFound />} />{' '}
					{/* Для остальных маршрутов */}
				</Routes>
			</div>
		</Router>
	);
};
