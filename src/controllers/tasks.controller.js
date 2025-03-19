import Task from '../models/task.model.js'

//para obtener todas las tareas de la base de datos
export const getTasks = async (req, res) => {
   try {
    const tasks = await Task.find({
        user: req.user.id //para filtrar y consultar solo las tarea del usuario autenticado
    }).populate("user", ) //populate sirve para poder traer todos los demas datos del usuario con ese id
    res.json(tasks)
   } catch (error) {
         return res.status(500).json({messagge:"Ocurrio un error al obtener las tareas"})
   }
}

//para consultar solo una trarea de la base de datos
export const getTask = async (req, res) => {
    try {
        //se le pasa el id por que se recupera de la url
    const task = await Task.findById(req.params.id).populate("user", )

    //si no se encuentra se retorna un codigo de estado 404 de no encontrado
    if(!task) return res.status(404).json({messagge:"tarea no encontrada"})

    //si se encuentra se retorna la tarea
    res.json(task)
    } catch (error) {
        return res.status(404).json({messagge:"tarea no encontrada"})
    }
}

//para insertar una tarea en la base de datos
export const createTask = async (req, res) => {
    try {
        const {title, description, date} = req.body
        const newTask = new Task ({
            title, 
            description,
            date,
            user: req.user.id
        })
        const savedTask = await newTask.save()
        res.json(savedTask)
    } catch (error) {
        return res.status(500).json({messagge:"Ocurrio un error al guardar la tarea"})
    }
}

//para eliminar una tarea de la base de datos
export const deleteTask = async (req, res) => {
     try {
        //se le pasa el id por que se recupera de la url
        const task = await Task.findByIdAndDelete(req.params.id)

        //si no se encuentra se retorna un codigo de estado 404 de no encontrado
        if(!task) return res.status(404).json({messagge:"tarea no encontrada"})
    
        //podemos retornar la tarea que se elimino o solo un mensaje
        //res.json(task)
        return res.status(204).json({messagge:"Tarea eliminada correctamente"})
     } catch (error) {
        return res.status(500).json({messagge:"Ocurrio un error al eliminar la tarea"})  
     }
}

//para actualizar una tarea de la base de datos
export const updateTask = async (req, res) => {
    try {
        //se le pasa el id por que se recupera de la url
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
            new: true //esto es para que no me retorne el dato viejo si no el que se actualizo
        })

        //si no se encuentra se retorna un codigo de estado 404 de no encontrado
        if(!task) return res.status(404).json({messagge:"tarea no encontrada"})
    
        //si se encuentra se retorna la tarea que se elimino
        res.json(task)
    } catch (error) {
        return res.status(500).json({messagge:"Ocurrio un error al actualizar la tarea"})
    }
}