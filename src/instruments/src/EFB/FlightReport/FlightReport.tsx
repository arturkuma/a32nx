/*
 * A32NX
 * Copyright (C) 2020-2021 FlyByWire Simulations and its contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import React, {useRef, useState} from 'react';
import {CurrentFlight, Map} from "@flybywiresim/map";
// import { Document, Page, Text, View, StyleSheet, PDFViewer } from '@react-pdf/renderer';
import html2PDF from 'jspdf-html2canvas';

// const styles = StyleSheet.create({
//     page: {
//         flexDirection: 'row',
//         backgroundColor: '#E4E4E4'
//     },
//     section: {
//         margin: 10,
//         padding: 10,
//         flexGrow: 1
//     }
// });

import { jsPDF } from "jspdf";
import Button from "../Components/Button/Button";



const handleGettingCurrentFlightData = (): CurrentFlight => ({
    flightNumber: 'elo',
    aircraftType: 'A32NX',
    altitude: 0,
    heading: 10,
    origin: '',
    destination: '',
    latitude: 0,
    longitude: 0,
});

const defaultOptions = {
    jsPDF: {
        unit: 'px',
        format: 'a4',
    },
    html2canvas: {
        imageTimeout: 15000,
        logging: true,
        useCORS: true
    },
    imageType: 'image/png',
    imageQuality: 1,
    margin: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
    },
    output: 'jspdf-generate.pdf',
    init: function() {},
    success: function(pdf) {
        pdf.save(this.output);
    }
}

const FlightReport = () => {
    const mapContainer = useRef();
    const [generated, setGenmerated] = useState(false)

    if(mapContainer) {
        // html2PDF(mapContainer.current, defaultOptions);
        // setGenmerated(true)
    }

    // const MyDocument = () => (
    //     <Document>
    //         <Page size="A4" style={styles.page}>
    //             <View style={styles.section}>
    //                 <Text>Section #1</Text>
    //             </View>
    //             <View style={styles.section}>
    //                 <Text>Section #2</Text>
    //             </View>
    //         </Page>
    //     </Document>
    // );

    // Default export is a4 paper, portrait, using millimeters for units
    // const doc = new jsPDF();
    //
    // doc.text("Hello world!", 10, 10);
    //
    // const elementHandler = {
    //     '#ignorePDF': function (element, renderer) {
    //         return true;
    //     }
    // };
    //
    // if(mapContainer) {
    //     doc.fromHTML(
    //         mapContainer.current,
    //         25,
    //         25,
    //         {
    //             'width': 180, 'elementHandlers': elementHandler
    //         });
    //     doc.save("a4.pdf");
    // }

    return (
        <div className="flex w-full h-full">
            {/*<PDFViewer>*/}
            {/*    <MyDocument />*/}
            {/*</PDFViewer>*/}

            <Button onClick={() => html2PDF(mapContainer.current, defaultOptions)} text={'elo'} />

            <div>

            </div>
            <div className="overflow-hidden" style={{height: '841px', width: '595px'}} ref={mapContainer}>
                <h1>test</h1>
                <Map currentFlight={handleGettingCurrentFlightData} disableMenu hideOthers />
            </div>
        </div>
    );
};

export default FlightReport;
