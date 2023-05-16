import React, { useState, useEffect } from "react";
import Estado from "../estados/Estados";
import Agregar from "./Agregar";
import Modificar from "./Modificar";

import { _, Grid } from 'gridjs-react';
import { esES } from "gridjs/l10n";

import { get_Citas_BD } from "../../firebase/Citas/CIT_CRUD";
import { formatearFechaHora } from "../../firebase/Fechas/Fechas";
import { DatoDeLaBD as DatoBD_USU } from "../../firebase/Ususarios/USU_CRUD";
import { DatoDeLaBD as DatoDB_ESP } from '../../firebase/Especialides/ESP_CRUD.js';

export default function Citas() {
    const [dataCitas, setDataCitas] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [usuarios, setUsuarios] = useState(new Map())

    async function obtenerDatos() {
        setDataCitas([]);
        setUsuarios(new Map())

        const datosBD = await get_Citas_BD();
        setDataCitas(datosBD);

        const esp = await DatoDB_ESP();
        const mapa = new Map(esp.map(dato => [dato.ID, dato.ESPECIALIDAD]));

        const usu = await DatoBD_USU();
        const map = new Map(usu.map(dato => [dato.ID, dato.NOMBRE + " " + dato.AP_PATERNO + " " + dato.AP_MATERNO + ' - ' + mapa.get(dato.ID_ESPECIALIDAD)]));
        setUsuarios(map)
        
        setIsLoading(false);
    }

    useEffect(() => {
        obtenerDatos();
    }, []);


    async function actualizarDatos() {
        const datosBD = await DatoDeLaBD();
        setUsuarios(datosBD);
    }

    return (

        <div className="rounded-4 pt-3 mt-4 border-gray shadow-custom" style={{ width: "111%", height: "630px"}} >
            <div className="container-fluid mt-4" >
                <div className="row">
                    <div className="col-6">
                        <h3>Gestión de citas</h3>
                    </div>
                    <div className="col-6 text-end">
                        <Agregar obtenerDatos={obtenerDatos} />
                    </div>
                </div>


                <div className="row col-12 mt-4 d-flex justify-content-center">
                    <div className="col-11">
                        {isLoading ? (
                            <div class="d-flex justify-content-center">
                                <div class="spinner-border" role="status">
                                    <span class="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        ) : (
                            <Grid
                                data={dataCitas.map(cita => [
                                    usuarios.get(cita.ID_USUARIO),
                                    cita.ID_PACIENTE,
                                    formatearFechaHora(cita.DATEINICIO),
                                    
                                    _(<Estado estado={cita.ID_ESTADOS} />),

                                    cita.ID_ESTADOS != 7 ?
                                    _(<Modificar 
                                        dato={cita} 
                                        medico={usuarios.get(cita.ID_USUARIO)} 
                                        obtenerDatos={obtenerDatos}
                                    />) : ''
                                ])}

                                columns={[
                                    'Medico',
                                    'Paciente',
                                    'Fecha y Hora',
                                    'Estado',
                                    'Acciones'
                                ]}
                                search={true}

                                pagination={{
                                    limit: 5,
                                }}

                                className={{
                                    table: 'table text-center ',
                                    thead: 'bg-dark-subtle',
                                    tbody: ' ',
                                }}

                                language={esES}
                            />

                        )}
                    </div>
                </div>
                
            </div>
        </div>


    )
}

// <table className="table align-middle">
//     <thead>
//         <tr className="table-secondary text-center">
//             <th>Medico</th>
//             <th>Paciente</th>
//             <th>Fecha y Hora</th>
//             <th>Estado</th>
//             <th>Acciones</th>
//         </tr>
//     </thead>
//     <tbody className="text-center align-middle">
//         {usuarios.map((dato, index) => (
//             <tr>
//                 <td className="text-start">{dato.ID_USUARIO}</td>
//                 <td>{dato.ID_PACIENTES}</td>
//                 <td>{dato.FECHAHORA}</td>
//                 <td> <Estado estado={dato.ID_ESTADOS} /></td>
//                 <td >
//                     <Modificar dato={dato}
//                         obtenerDatos={obtenerDatos} />
//                 </td>
//             </tr>
//         ))}
//     </tbody>
// </table>