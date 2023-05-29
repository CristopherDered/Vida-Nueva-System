import React, { useState, useEffect } from "react";
import Turnos_BarChart from "./Turnos/graficaBarras";
import Turnos_SolidGauge from "./Turnos/SolidGauge";
import Citas_BarChart from "./Citas/graficaBarras";
import Citas_SolidGauge from "./Citas/SolidGauge";

import { BD_Turnos_Estadisticas } from "../../firebase/Turnos/TURN_CRUD";

import { DateRangePicker } from 'rsuite';

export default function Estadisticas() {
    const [isLoading, setIsLoading] = useState(true);

    const [dateRangeT, setDateRangeT] = useState([new Date().setHours(0, 0, 0, 0), new Date().setHours(23, 59, 59, 999)])

    const [dataTurnos, setDataTurnos] = useState([])
    const [dataCitas, setDataCitas] = useState([])

    async function obtenerTunosCitas() {
        setIsLoading(true)
        setDataTurnos(await BD_Turnos_Estadisticas(null, null));
        setIsLoading(false)
    }
    useEffect(() => {
        obtenerTunosCitas()
    }, [])

    const dataGB = [
        {
            NOMBRE: "CM Atendidos",
            TOTAL: 3025,

        },
        {
            NOMBRE: "CM Cancelados",
            TOTAL: 2800
        }, {
            NOMBRE: "TP Atendidos",
            TOTAL: 3025,

        },
        {
            NOMBRE: "TP Cancelados",
            TOTAL: 2800
        }, {
            NOMBRE: "AI Atendidos",
            TOTAL: 3025,

        },
        {
            NOMBRE: "AI Cancelados",
            TOTAL: 2800
        }, {
            NOMBRE: "CE Atendidos",
            TOTAL: 3025,

        },
        {
            NOMBRE: "CE Cancelado",
            TOTAL: 2800
        }
    ];

    const data = [
        { category: "Lithuania", value: 501.9 },
        { category: "Czechia", value: 301.9 },
        { category: "Ireland", value: 201.1 },
        { category: "Germany", value: 165.8 },
        { category: "Australia", value: 139.9 },
        { category: "Austria", value: 128.3 },
        { category: "UK", value: 99 }
    ];


    const hanndleFecha = async (evt) => {
        if (evt) {
            setIsLoading(true)
            setDataTurnos(await BD_Turnos_Estadisticas(evt[0], evt[1]));
            setIsLoading(false)
        } else {
            setIsLoading(true)
            setDataTurnos(await BD_Turnos_Estadisticas(null, null));
            setIsLoading(false)
        }
        console.log('Hola')
        console.log(dataTurnos)
    }

    return (
        <div
            className="rounded-4 pt-3 mt-4 border-gray shadow-custom"
            style={{ width: "111%", height: "1200px"}}>


            <div className="container-fluid mt-4">

                <div className="row mt-3">
                    <div className="col-12 text-center d-flex">
                        <DateRangePicker
                            character=" - "
                            format="dd-MM-yyyy HH:mm:ss"
                            onClean={() => {
                                hanndleFecha(null)
                            }}
                            defaultCalendarValue={dateRangeT}
                            onChange={(evt) => {
                                hanndleFecha(evt)
                            }} 

                            //Quita los busquedas por defecto, tales como "Today", "Yesterdar", "Last 7 days"
                            ranges={[]}

                            placeholder={'DD-MM-YYYY HH:MM:SS - DD-MM-YYYY HH:MM:SS'}
                            
                            />
                        <h2 > Estadisticas de turnos</h2>
                    </div>
                    <div className="" style={{ height: "500px" }}>
                        {
                            isLoading ? (
                                <div class="d-flex justify-content-center">
                                    <div class="spinner-border" role="status">
                                        <span class="visually-hidden">Loading...</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="row">
                                    <div className="col-8">
                                        <Turnos_BarChart data={dataTurnos} />
                                    </div>
                                    <div className="col-4">
                                        <Turnos_SolidGauge data={dataTurnos} />
                                    </div>
                                </div>
                            )
                        }
                    </div>
                </div >

                <div className="row mt-3">
                    <div className="col-12 text-center d-flex">
                        <DateRangePicker
                            character=" - "
                            format="dd-MM-yyyy HH:mm:ss"
                            defaultCalendarValue={[new Date('2022-02-01 00:00:00'), new Date('2022-05-01 23:59:59')]}
                        />
                        <h2>Estadisticas de citas</h2>
                    </div>

                    <div className="" style={{ height: "500px" }}>
                        {
                            isLoading ? (
                                <div class="d-flex justify-content-center">
                                    <div class="spinner-border" role="status">
                                        <span class="visually-hidden">Loading...</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="row">
                                    <div className="col-8">
                                        <Citas_BarChart data={dataGB} />
                                    </div>
                                    <div className="col-4">
                                        <Citas_SolidGauge data={data} />
                                    </div>
                                </div>
                            )
                        }
                    </div>
                </div>
            </div >


        </div >

    );
}
