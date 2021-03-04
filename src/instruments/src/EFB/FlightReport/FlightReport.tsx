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
import { jsPDF } from "jspdf";
import domtoimage from 'dom-to-image';

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


const FlightReport = () => {
    const mapContainer = useRef();

    return (
        <div className="flex w-full h-full">
            <Button
                onClick={() => {
                    domtoimage.toPng(mapContainer.current)
                        .then((url) => {
                            const doc = new jsPDF({ unit: "px", format: 'a4' });
                            const width = doc.internal.pageSize.getWidth();
                            const height = doc.internal.pageSize.getHeight();

                            doc.text("Hello world!", 10, 10);

                            doc.addPage();

                            doc.addImage(url, 'PNG', 0, 0, width, height);

                            doc.save("a4.pdf");

                            // window.saveAs(blob, 'my-node.png');
                        });
                }}
                text={'elo'}
            />

            <div style={{height: '0', width: 0, overflow: 'hidden'}}>
                <div className="overflow-hidden" style={{height: `${631 * 2}px`, width: `${446 * 2}px`}} ref={mapContainer}>
                    <Map currentFlight={handleGettingCurrentFlightData} disableMenu hideOthers zoom={7} />
                </div>

                {/*<div style={{position: 'absolute', top: 0, left: 25, height: '100%', width: '100%', backgroundColor: 'red', 'z-index': 100000}}></div>*/}
            </div>
        </div>
    );
};

export default FlightReport;
