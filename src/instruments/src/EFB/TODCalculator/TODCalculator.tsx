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

import React from "react";
import GroundSpeed from "./GroundSpeed/GroundSpeed";
import Data from "./Data/Data";
import Result from "./Result/Result";

const TODCalculator = () => {
    return (
        <div className="flex p-6 w-full">
            <GroundSpeed className={'w-4/12 mr-4'} />

            <Data className="w-3/12" />

            <Result className="w-5/12 ml-4" />
        </div>
    );
};

export default TODCalculator;