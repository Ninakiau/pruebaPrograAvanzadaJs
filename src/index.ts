import { Project } from './interfaces/IProject';
import { Task } from './interfaces/ITask';
import { projects } from './data/projects';
import EventEmitter from 'node:events';

// Implementa una función que permita añadir nuevas tareas a un proyecto.


const addTask = (projectId: number, newTask: Task) => {
    const project = projects.find(project => project.projectId === projectId); // Buscamos el proyecto por su id
    if (project) {
        project.tasks.push(newTask); // Añadimos la nueva tarea al array de tareas del proyecto
    } else {
        console.error("Proyecto no encontrado");
    }
};

// Desarrolla una función que utilice métodos de array (map, filter, reduce) para generar un resumen del proyecto mostrando el número de tareas en cada estado.

const getProjectSummaries = () => {
    const summaries = projects.map(project => {
        // Filtramos las tareas según su estado estado y contamos con el método length, no vi necesario usar reduce
        const completedTasks = project.tasks.filter(task => task.status === "completada").length;
        const pendingTasks = project.tasks.filter(task => task.status === "pendiente").length;
        const inProgressTasks = project.tasks.filter(task => task.status === "en progreso").length;

        // Con map devolvemos un resumen de cada proyecto
        return {
            projectName: project.name,
            completedTasks,
            pendingTasks,
            inProgressTasks
        };
        
    });
    return summaries;
};

// Desarrolla una función que ordene las tareas de un proyecto por fecha límite utilizando el método sort de JavaScript.
const sortTasksByDeadline = (projectId: number) => { // Función para ordenar las tareas de un proyecto por fecha límite
    const project = projects.find(project => project.projectId === projectId); // Buscar el proyecto por su id

    if (project) {
        // Ordenar las tareas por la fecha límite (de más antigua a más reciente)
        project.tasks.sort((taskA, taskB) => {
            // Comparar las fechas límite como cadenas de texto
            if (taskA.deadline < taskB.deadline) return -1; // taskA tiene una fecha anterior
            if (taskA.deadline > taskB.deadline) return 1;  // taskB tiene una fecha anterior
            return 0; // Las fechas son iguales
        });
    }
        if (project) {
            console.log(`Tareas del proyecto "${project.name}" ordenadas por fecha límite:`);
            project.tasks.forEach(task => {
                console.log(`${task.description} - Fecha límite: ${task.deadline}`);
            });
        }
    
};
// Crea una función de orden superior filtrarTareasProyecto que tome una función de filtrado como argumento y la aplique a la lista de tareas de un
// proyecto.
const filterTaskByProject = (projectId: number, taskFilter:any) => { //No sabía que otro tipo ponerle a taskFilter :c porfavor dame feedback de esto
    const project = projects.find(project => project.projectId === projectId); // Buscar el proyecto por su id
    return project?.tasks.filter(taskFilter); // Retornamos las tareas filtradas
}
//Ejemplo: filtraremos las tareas completadas
const completedTasks = (task:Task) => task.status === "completada";

// Implementa una función calcularTiempoRestante que utilice el método reduce para calcular el número total de días que faltan para completar todas
// las tareas pendientes de un proyecto. 
// En esta no entiendo muy bien el objetivo porque al sumar los días restantes se suman los días que faltan para que se cumpla la fecha límite de cada tarea por ejemplo si para una tarea me faltan 5 días y para otra 3 días, al sumarlos me daría 8 días, siendo que debería decir cuanto falta para cada tarea por separado, eso haría más sentido, pero esto no es lo que pide. 

const remainingTime= (projectId: number) => {
    const project = projects.find(project => project.projectId === projectId); // Buscar el proyecto por su id
// Si se encuentra el proyecto, calcular el tiempo restante
if (project) {
    const remainingTasks = project.tasks.filter(task => task.status === "pendiente"); // Filtrar las tareas pendientes
    const remainingTime = remainingTasks.reduce((total, task) => {
        const deadline = new Date(task.deadline); // Convertir la fecha límite a un objeto Date
        const today = new Date(); // Obtener la fecha actual
        const difference = deadline.getTime() - today.getTime(); // Calcular la diferencia en milisegundos
        const days = Math.ceil(difference / (1000 * 3600 * 24)); // Convertir milisegundos a días
        return total + (days > 0 ? days : 0); // Sumar los días restantes, solo si la diferencia es positiva
    }, 0); // Inicializar el total en 0
    return `Tiempo restante para completar las tareas pendientes: ${remainingTime} días`;
}

}

// Desarrolla una función obtenerTareasCriticas que identifique y retorne las tareas que están a menos de 3 días de su fecha límite y aún no están
// completadas.
const getCriticalTasks = projects.map(project => {  // Mapear los proyectos
    // Filtrar las tareas no completadas
    const uncompletedTasks = project.tasks.filter(task => task.status !== "completada" )
    // Filtrar las tareas críticas (a menos de 3 días de su fecha límite)
    const criticalTasks = uncompletedTasks.filter(task => {
        const deadline = new Date(task.deadline); // Convertir la fecha límite a un objeto Date
        const today = new Date(); // Obtener la fecha actual
        const difference = deadline.getTime() - today.getTime(); // Calcular la diferencia en milisegundosq
        const days = Math.ceil(difference / (1000 * 3600 * 24)); // Convertir milisegundos a días
        return days < 3; // Retornar si faltan menos de 3 días para la fecha límite

    });
    if (criticalTasks.length > 0) { // Si hay tareas críticas
        return { 
            // Retornar el nombre del proyecto y las descripciones de las tareas críticas
            projectName: project.name,
            criticalTasks: criticalTasks.map(task => task.description)
        };
    } else {
        return {
            // Si no hay tareas críticas, mostrar un mensaje
            projectName: project.name,
            criticalTasks: "No hay tareas críticas"
        }
    }
});

// Desarrolla una función cargarDetallesProyecto que simule una llamada
// asíncrona a una API para cargar los detalles de un proyecto.
// Utiliza Promises o async/await

const loadProjectDetails = async (projectId: number) :Promise<Project | undefined> => {
    // Simular una llamada asíncrona a una API
    try{
        const project = await new Promise<Project| undefined>((resolve, reject) => { // Crear una nueva promesa
            setTimeout(() => {
                const project = projects.find(project => project.projectId === projectId); // Buscar el proyecto por su id
                if (project) {
                    // Si se encuentra el proyecto, resolver la promesa con los detalles del proyecto
                    resolve(project);    
                } else {
                    // Si no se encuentra el proyecto, rechazar la promesa con un error
                    reject(new Error("Proyecto no encontrado"));
                }
        },1000); // Simular un retardo de 1 segundo
    });
    return project;
    } catch(error){ // Capturar errores
        console.error("Error al cargar los detalles del proyecto"); // Mostrar un mensaje de error
        throw error;
    }
};

// Crea una función actualizarEstadoTarea que simule la actualización del
// estado de una tarea en el servidor y maneje tanto el caso de éxito como el de error.

const updateTaskStatus = async (projectId: number, taskId: number,  newStatus: Task['status']) => { // Actualizar el estado de la tarea le pasa el nuevo estado, el id del proyecto y el id de la tarea
    try {
        const project = await loadProjectDetails(projectId); // Cargar los detalles del proyecto
        const task = project?.tasks.find(task => task.taskId === taskId); // Buscar la tarea por su id
        if (task) {
            task.status = newStatus; // Actualizar el estado de la tarea
            // Emitir un evento cuando se completa una tarea
            if (newStatus === "completada") {
                eventEmitter.emit('taskCompleted'); // Emitir un evento cuando se completa una tarea
            }
            return task;
        } else {
            throw new Error("Tarea no encontrada"); // Lanzar un error si la tarea no se encuentra
        }
    } catch (error) {
        console.error("Error al actualizar el estado de la tarea"); // Mostrar un mensaje de error si no se puede actualizar el estado del proyecto
        throw error;
    }
}

// Implementa un sistema simple de notificacionesTareas que permita a
// diferentes partes del código "escuchar" cuando se completa una tarea

const eventEmitter = new EventEmitter();

eventEmitter.on( 'taskCompleted', ()=>{
    console.log("¡¡¡T A R E A   C O M P L E T A D A !!!!!!");
});

// P R U E B A S

// A Ñ A D I R   N U E V A   T A R E A
console.log("P R O Y E C T O   1");
console.log("A N T E S   D E   A Ñ A D I R   N U E V A   T A R E A");
console.log(projects[1]);
console.log("A Ñ A D I R   N U E V A   T A R E A");
addTask(1, {taskId:4, description:"Crear botón de inicio", status:"pendiente", deadline:"2024-11-20"}); // Añadir una tarea al proyecto con id 1
console.log("D E S P U É S   D E   A Ñ A D I R   N U E V A   T A R E A");
console.log(projects[1]);

// R E S U M E N   D E   P R O Y E C T O S
console.log("R E S U M E N   D E   P R O Y E C T O S");
console.table(getProjectSummaries()); // Mostrar resumen de proyectos


// O R D E N A R   T A R E A S   P O R   F E C H A   L Í M I T E
console.log("O R D E N A R   T A R E A S  D E L  P R O Y E C T O  1  P O R   F E C H A   L Í M I T E");
sortTasksByDeadline(0); // Ordenar las tareas del proyecto con id 1 por fecha límite


//F I L T R A R   T A R E A S   C O M P L E T A D A S
console.log("F I L T R A R   T A R E A S   C O M P L E T A D A S  D E L  P R O Y E C T O  0  C O N   F I L T R O   D E   O R D E N   S U P E R I O R");
console.table(filterTaskByProject(0, completedTasks)); 

// C A L C U L A R   T I E M P O   R E S T A N T E
console.log("C A L C U L A R   T I E M P O   R E S T A N T E  D E L  P R O Y E C T O  1");
console.log(remainingTime(1));

// O B T E N E R   T A R E A S   C R Í T I C A S
console.log("O B T E N E R   T A R E A S   C R Í T I C A S");
console.log(getCriticalTasks); // Mostrar las tareas críticas de cada proyecto

// C A R G A R   D E T A L L E S   D E L   P R O Y E C T O
console.log("C A R G A R   D E T A L L E S   D E L   P R O Y E C T O");
loadProjectDetails(1).then(project => { // Cargar promesa con los detalles del proyecto con id 1
    console.log(project); // Mostrar los detalles del proyecto
}).catch(error => {
    console.error(error.message); // Mostrar el mensaje de error
});

// U P D A T E   S T A T U S   D E   T A R E A
console.log("A C T U A L I Z A R   E S T A D O   D E   T A R E A");
updateTaskStatus(1, 2, "pendiente").then(task => {
    console.log("Estado de la tarea actualizado:", task);
}).catch(error => {
    console.error(error.message);
})

updateTaskStatus(1, 2, "completada").then(task => {
    console.log("Estado de la tarea actualizado:", task);
}).catch(error => {
    console.error(error.message);
})

