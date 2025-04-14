import styles from './TaskItem.module.scss'

export default function TaskItem({
                                     task,
                                     editingId,
                                     setEditingId,
                                     editedText,
                                     setEditedText,
                                     onToggle,
                                     onRemove,
                                     onEdit,
                                 }) {
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            onEdit(task.id, editedText)
            setEditingId(null)
        }
    }

    const handleBlur = () => {
        onEdit(task.id, editedText)
        setEditingId(null)
    }

    return (
        <li>
            <label className={styles.taskLabel}>
                <input
                    type="checkbox"
                    checked={task.done}
                    onChange={() => onToggle(task.id)}
                />
                {editingId === task.id ? (
                    <input
                        type="text"
                        value={editedText}
                        onChange={(e) => setEditedText(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onBlur={handleBlur}
                        autoFocus
                        className={styles.editInput}
                    />
                ) : (
                    <span
                        className={`${task.done ? styles.done : ''} ${styles.taskText}`}
                    >
                        {task.text}
                    </span>
                )}
            </label>

            <button
                onClick={() => setEditingId(task.id)}
                className={styles.editButton}
                title="Edytuj zadanie"
            >
                ✏️
            </button>

            <button
                onClick={() => onRemove(task.id)}
                className={styles.deleteButton}
                title="Usuń zadanie"
            >
                🗑
            </button>
        </li>
    )
}