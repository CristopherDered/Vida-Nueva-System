import { get_Todas_Citas_BD } from "../Citas/CIT_CRUD";
import { DatoDeLaBDActivos } from "../Especialides/ESP_CRUD";
import { getCurrentDate, ts_to_date } from "../Fechas/Fechas";
import { db } from "../firebase"
import { collection, addDoc, getDocs, setDoc, doc, where, query, updateDoc, orderBy } from "firebase/firestore";
import { DatoDeLaBD as get_All_Usuarios } from "../../firebase/Ususarios/USU_CRUD";

/**
 * Inserta un nuevo turno en la coleccion TURNOS
 * Parametros, ID del servicio, y el contador del servicio
 */
export async function insertarTurno(id, count) {
    const newTurno = await addDoc(collection(db, 'TURNOS'), {
        "ID_TURNO": `${id}-${count}`,
        "ID_SERVICIO": id,
        "ID_ESTADOS": 4,
        "FECHAHORA": getCurrentDate(),

    });
    return newTurno.id
}



export async function datosNuevoTurno(id) {
    const datos = {};
    const querySnapshot = await getDocs(query(collection(db, "TURNOS")));
    querySnapshot.forEach((doc) => {
        if (doc.id == id) {
            datos["ID"] = doc.id;
            Object.assign(datos, doc.data())
        }
    });
    return datos;
}


export async function BD_Turnos_Actuales() {
    const datos = [];
    const llamado = []
    const fecha = new Date()
    const currentDate = {
        year: fecha.getFullYear(),
        month: fecha.getMonth(),
        day: fecha.getDate()
    }
    const turnosRef = collection(db, "TURNOS") //Apuntamos a la coleccion
    const q = query(turnosRef,
        where('ID_ESTADOS', 'in', [4, 6]),
        orderBy("FECHAHORA"));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
        let docDate = ts_to_date(doc.data().FECHAHORA)

        let year = docDate.getFullYear()
        let month = docDate.getMonth()
        let day = docDate.getDate()

        if (currentDate.day == day &&
            currentDate.month && month &&
            currentDate.year && year) {

            if (doc.data().ID_ESTADOS == 4) {
                let list_Data = doc.data()
                list_Data['ID'] = doc.id
                datos.push(list_Data);

            } else if (doc.data().ID_ESTADOS == 6) {
                let list_Data = doc.data()
                list_Data['ID'] = doc.id
                llamado.push(list_Data);
            }

        }


    });
    return [datos, llamado];
}

export async function DatosBD_Turnos() {
    /**
     * Se guarda la fecha actual
     */
    const datos = [];

    const fecha = new Date()
    const currentDate = {
        year: fecha.getFullYear(),
        month: fecha.getMonth(),
        day: fecha.getDate()
    }

    /* Apuntamos a la coleccion */
    const turnosRef = collection(db, "TURNOS")
    /* Ordenamos la consulta */
    const q = query(turnosRef, orderBy("FECHAHORA"));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
        /* Obtenemos la fecha del turno */
        let docDate = ts_to_date(doc.data().FECHAHORA)
        let year = docDate.getFullYear()
        let month = docDate.getMonth()
        let day = docDate.getDate()

        if (currentDate.day == day &&
            currentDate.month && month &&
            currentDate.year && year) {


            let list_Data = doc.data()
            list_Data['ID'] = doc.id
            datos.push(list_Data);


        }


    });
    return datos
}


//----------------------------------------------------------------------------------------------------------------------------------
//                                  Aqui empieza las estadisticas de citas
//----------------------------------------------------------------------------------------------------------------------------------

export async function EstadisticasCitas() {
    const data = []
    const especialidades = await DatoDeLaBDActivos()
    especialidades.map((espe) => {
        data.push({
            NOMBRE: `${espe.ESPECIALIDAD} Atendidos`,
            TOTAL: 5
        })
        data.push({
            NOMBRE: `${espe.ESPECIALIDAD} Cancelados`,
            TOTAL: 5
        })
    })

    const allCitas = await get_Todas_Citas_BD()

    allCitas.map( (cita) =>{

    })

    const allMedicos = await get_All_Usuarios()
    console.log(allCitas)
    console.log(allMedicos)
    console.log(especialidades)

    console.log(data)
    return data;

}