import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    MenuItem
} from '@mui/material'
import { Toaster, toast } from "react-hot-toast"
import { _, Grid } from 'gridjs-react';

import { useState, useEffect } from 'react'
import { formatearFechaHora, ts_to_HM, ts_to_date } from '../../firebase/Fechas/Fechas.js';
import { get_Expendientes_Paciente } from '../../firebase/Consultas/CTAS_CRUD.js';
import { DatoDeLaBD as DatoBD_USU } from "../../firebase/Ususarios/USU_CRUD";
import { DatoDeLaBD as DatoDB_ESP } from '../../firebase/Especialides/ESP_CRUD.js';
import Visualizar from './Visualizar.jsx';
import { Document, Page, PDFDownloadLink, Text, View, StyleSheet } from '@react-pdf/renderer'
import VisualizarPDF from './VisualizarPDF.jsx';





export default function VerConsultas({ ID_PACIENTE, DATOS_PACIENTE }) {
    const [open, setOpen] = useState(false)
    const [data, setData] = useState([])
    const [usuarios, setUsuarios] = useState(new Map())
    

    async function obtenerExpedientes() {
        setData([])
        const registro = await get_Expendientes_Paciente(ID_PACIENTE)
        setData(registro)
        const esp = await DatoDB_ESP();
        const mapa = new Map(esp.map(dato => [dato.ID, dato.ESPECIALIDAD]));
        const usu = await DatoBD_USU();

        // const map = new Map(usu.map(dato => [dato.ID,  mapa.get(dato.ID_ESPECIALIDAD) + ' - ' + dato.NOMBRE + " " + dato.AP_PATERNO + " " + dato.AP_MATERNO  ]));
        const map = new Map(usu.map(dato => [dato.ID, dato.NOMBRE + " " + dato.AP_PATERNO + " " + dato.AP_MATERNO + ' - ' + mapa.get(dato.ID_ESPECIALIDAD)]));
        setUsuarios(map)
        
    }


    useEffect(() => {
        obtenerExpedientes()
    }, []);

    /**
     * Este metodo insertara al domicilio y al usuario
     * Primero inserta al domicilio, guarda su ID y se lo asigna al 
     * objeto que tiene los datos del usuario, y por ultimo inserta los datos del usuario
     */

    return (
        <div>

            <Button onClick={() => setOpen(true)}>
                <img
                    src="src/css/img/Medico/Expediente.png"
                    style={{ width: "30px" }}
                />
            </Button>
            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                aria-labelledby='dialog-title'
                aria-describedby='dialog-description'
                PaperProps={{
                    style: {
                        maxWidth: '1000px',
                    },
                }}>

                <DialogTitle id='dialog-title'>
                    <span style={{ color: "black", fontSize: "23px" }}>Historial de consultas medicas</span>
                    <Button onClick={() => {
                        setOpen(false)
                        reiniciarFormulario()
                    }}>X</Button>
                    <hr />
                </DialogTitle>


                <DialogContent>
                    <PDFDownloadLink document={<VisualizarPDF DATOS_PACIENTE={DATOS_PACIENTE} MEDICOS={usuarios} DATA={data} />} fileName='JoseJose' >
                        <Button
                            variant="text"
                            color='error'
                            style={{ textTransform: 'capitalize' }}>
                            Generar expediente<span>&nbsp;PDF</span>&nbsp;<i className="bi bi-file-pdf"></i>
                        </Button>
                    </PDFDownloadLink>

                    <DialogContentText className='mt-2' id='dialog-description'>

                        <Grid
                            data={data.map(dato => [
                                usuarios.get(dato.ID_USUARIO),
                                formatearFechaHora(dato.FECHAHORA),
                                _(<Visualizar datosMedico={usuarios.get(dato.ID_USUARIO)}
                                    datos={dato} />)
                            ])}

                            columns={[
                                'Medico',
                                'Fecha hora',
                                'Ver consulta'
                            ]}


                            search={{
                                fields: ['CURP']
                            }}

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
                                    'placeholder': 'Buscar',

                                },
                                'pagination': {
                                    'previous': 'Anterior',
                                    'next': 'Siguiente',
                                    'showing': 'Mostrando',
                                    'results': () => 'Registros'
                                }
                            }}
                        />


                    </DialogContentText>

                </DialogContent>

                <DialogActions className='align-middle'>

                </DialogActions>
            </Dialog>
            <Toaster
                position="top-right"
                reverseOrder={true}
            />
        </div>
    )
}