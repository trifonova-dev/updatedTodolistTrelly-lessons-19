import {TaskStatus} from "@/common/enums"
import {useGetTasksQuery} from "@/features/todolists/api/tasksApi"
import type {DomainTodolist} from "@/features/todolists/model/todolists-slice"
import List from "@mui/material/List"
import {TaskItem} from "./TaskItem/TaskItem"
import {TasksSkeleton} from "@/features/todolists/ui/Todolists/TodolistItem/Tasks/TasksSkeleton/TasksSkeleton";
import {useAppDispatch} from "@/common/hooks";
import {useEffect} from "react";
import {setAppErrorAC} from "@/app/app-slice";

type Props = {
    todolist: DomainTodolist
}

export const Tasks = ({todolist}: Props) => {
    const {id, filter} = todolist

    const {data, isLoading, error, isError} = useGetTasksQuery(id)
    console.log({isError, error})

    const dispatch = useAppDispatch()

    let filteredTasks = data?.items
    if (filter === "active") {
        filteredTasks = filteredTasks?.filter((task) => task.status === TaskStatus.New)
    }
    if (filter === "completed") {
        filteredTasks = filteredTasks?.filter((task) => task.status === TaskStatus.Completed)
    }

    useEffect(() => {
        if (!error) return
        if ("status" in error) {
            const errorMessage = "error" in error ? error.error : JSON.stringify(error.data)
            dispatch(setAppErrorAC({error: errorMessage}))
        }
        else {
            dispatch(setAppErrorAC({error: error.message || "Something went wrong"}))
        }
    }, [error])

    if (isLoading) {
        return <TasksSkeleton/>
    }

    return (
        <>
            {filteredTasks?.length === 0 ? (
                <p>Тасок нет</p>
            ) : (
                <List>{filteredTasks?.map((task) => <TaskItem key={task.id} task={task} todolist={todolist}/>)}</List>
            )}
        </>
    )
}
