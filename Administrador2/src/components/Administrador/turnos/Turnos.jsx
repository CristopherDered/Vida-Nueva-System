import React, { useEffect, useState } from "react";
import Estado from "../estados/Estados";
import { DatosBD_Turnos } from "../../firebase/Turnos/TURN_CRUD";
import { ts_to_HM } from "../../firebase/Fechas/Fechas";
import { _, Grid } from 'gridjs-react';


export default function Turnos() {
    const [turnos, setTurnos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    async function obtenerDatos() {

        setTurnos([])
        const datosBD = await DatosBD_Turnos();
        //console.log(datosBD)
        setTurnos(datosBD);
        //setIsLoading(false);
        setIsLoading(false)
    }

    useEffect(() => {
        obtenerDatos();
    }, []);

    return (

        <div className="rounded-4 pt-3 mt-5 border-gray shadow-custom" style={{ width: "1250px" }} >

            <div className="container-fluid mt-4" >

                <div className="row">
                    <div className="col-6">
                        <h3>Turnos del dia</h3>
                    </div>
                    <div className="col-6 text-end">
                        <button className="btn btn-primary">Agregar</button>
                    </div>
                </div>





                <div className="row col-12 mt-4 d-flex justify-content-center">
                    <div className="col-11">

                        {isLoading ?
                            (
                                <div class="d-flex justify-content-center">
                                    <div class="spinner-border" role="status">
                                        <span class="visually-hidden">Loading...</span>
                                    </div>
                                </div>
                            ) : (

                                <Grid
                                    data={turnos.map(tipo => [
                                        tipo.ID_TURNO,
                                        tipo.ID_SERVICIO,
                                        ts_to_HM(tipo.FECHAHORA),
                                        _(<Estado estado={tipo.ID_ESTADOS} />)

                                    ])}

                                    columns={[
                                        'Abreviatura',
                                        'Tipo de servicio',
                                        'Hora',
                                        'Estatus',
                                        'Acciones',
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

                                    language={{
                                        'search': {
                                            'placeholder': 'Abreviatura',

                                        },
                                        'pagination': {
                                            'previous': 'Anterior',
                                            'next': 'Siguiente',
                                            'showing': 'Mostrando',
                                            'results': () => 'Registros'
                                        }
                                    }}
                                />

                            )}
                    </div>
                </div>
            </div>
        </div>


    )
};
