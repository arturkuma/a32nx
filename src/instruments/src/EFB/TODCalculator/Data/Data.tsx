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

import {connect} from 'react-redux';
import Input from "../../Components/Form/Input/Input";
import React, {useEffect, useState} from "react";
import Card from "../../Components/Card/Card";
import Divider from "../../Components/Divider/Divider";
import {TOD_CALCULATOR_REDUCER} from "../../Store";
import {
    setTodCurrentAltitudeSync,
    setTodData
} from "../../Store/action-creator/tod-calculator";
import {TOD_CALCULATION_TYPE} from "../../Enum/TODCalculationType.enum";
import Button, {BUTTON_TYPE} from "../../Components/Button/Button";
import {round} from 'lodash';
import {useSimVar} from "../../../Common/simVars";
import {TOD_INPUT_MODE} from "../../Enum/TODInputMode.enum";

const Data = ({
    currentAltitudeSyncEnabled,
    calculationInputSyncEnabled,
    currentAltitude,
    targetAltitude,
    calculation: { type: calculationType, input: calculationInput },
    setTodCurrentAltitudeSync,
    setTodData,
    ...props
}) => {
    let [altitude] = useSimVar("INDICATED ALTITUDE", "feet", 1_000);
    let [distance] = useSimVar("GPS WP DISTANCE", "nautical miles", 1_000);
    let [verticalSpeed] = useSimVar("VERTICAL SPEED", "feet per minute", 1_000);
    let [pitchAngle] = useSimVar("L:A32NX_AUTOPILOT_FPA_SELECTED", "degree", 1_000);
    let [trkModeActive] = useSimVar("L:A32NX_TRK_FPA_MODE_ACTIVE", "bool", 1_000);

    altitude = round(altitude, -1);
    distance = round(distance, 1);
    verticalSpeed = round(verticalSpeed);
    pitchAngle = round(pitchAngle, 1);

    const syncedInput = ({
        [TOD_CALCULATION_TYPE.DISTANCE]: distance,
        [TOD_CALCULATION_TYPE.VERTICAL_SPEED]: verticalSpeed,
        [TOD_CALCULATION_TYPE.FLIGHT_PATH_ANGLE]: pitchAngle,
    })[calculationType] || undefined;

    const inputValid = (type: TOD_CALCULATION_TYPE, input) => ({
        [TOD_CALCULATION_TYPE.DISTANCE]: input > 0,
        [TOD_CALCULATION_TYPE.VERTICAL_SPEED]: input < -50,
        [TOD_CALCULATION_TYPE.FLIGHT_PATH_ANGLE]: trkModeActive && input < 0,
    })[type];

    useEffect(() => {
        if(!currentAltitudeSyncEnabled) {
            return;
        }

        setTodData({ currentAltitude: altitude });
    }, [currentAltitudeSyncEnabled, altitude]);

    useEffect(() => {
        if(!calculationInputSyncEnabled) {
            return;
        }

        if(!inputValid(calculationType, syncedInput)) {
            setTodData({ calculationInputMode: TOD_INPUT_MODE.MANUAL, calculation: {input: '', type: undefined }});
            return;
        }

        setTodData({ calculation: {input: syncedInput, type: calculationType }});
    }, [calculationInputSyncEnabled, distance, verticalSpeed, pitchAngle]);

    const calculationTypes = [
        {label: 'Distance', rightLabel: 'NM', type: TOD_CALCULATION_TYPE.DISTANCE, syncValue: distance, negativeValue: false},
        {label: 'Vertical speed', rightLabel: 'ft/min', type: TOD_CALCULATION_TYPE.VERTICAL_SPEED, syncValue: verticalSpeed, negativeValue: true},
        {label: 'Angle', rightLabel: 'degrees', type: TOD_CALCULATION_TYPE.FLIGHT_PATH_ANGLE, syncValue: pitchAngle, negativeValue: true}
    ];

    return (
        <Card title={'Data'} childrenContainerClassName={'flex-1 flex flex-col justify-start'} {...props}>
            <Input
                label={'Current altitude'}
                type={'number'}
                className={'dark-option mb-4 pr-1'}
                rightComponent={(
                    <div className={'flex items-center justify-center'}>
                        <span className={'text-2xl mr-4'}>ft</span>
                        <Button
                            text={'SYNC'}
                            type={currentAltitudeSyncEnabled ? BUTTON_TYPE.BLUE : BUTTON_TYPE.BLUE_OUTLINE}
                            onClick={() => setTodCurrentAltitudeSync(!currentAltitudeSyncEnabled)}
                        />
                    </div>
                )}
                value={currentAltitude}
                onChange={(currentAltitude) => setTodData({ currentAltitude })}
                disabled={currentAltitudeSyncEnabled}
            />

            <Input
                label={'Target altitude'}
                type={'number'}
                className={'dark-option mb-6'}
                rightComponent={<span className={'text-2xl'}>ft</span>}
                value={targetAltitude}
                onChange={(targetAltitude) => setTodData({ targetAltitude })}
            />

            <Divider className={'mb-6'} />

            {calculationTypes.map(({ label, rightLabel, type, syncValue, negativeValue }) => (!calculationInput || calculationType === type) && (
                <>
                    <Input
                        label={label}
                        type={'number'}
                        className={'dark-option mb-2 pr-1'}
                        leftInnerComponent={negativeValue ? <span className={'text-2xl'}>-</span> : null}
                        rightComponent={(
                            <div className={'flex items-center justify-center'}>
                                <span className={'text-2xl pr-3'}>{rightLabel}</span>

                                {inputValid(type, syncValue) && (
                                    <Button
                                        className={'ml-1'}
                                        text={'SYNC'}
                                        type={calculationInputSyncEnabled ? BUTTON_TYPE.BLUE : BUTTON_TYPE.BLUE_OUTLINE}
                                        onClick={() => setTodData({
                                            calculationInputMode: !calculationInputSyncEnabled ? TOD_INPUT_MODE.AUTO : TOD_INPUT_MODE.MANUAL,
                                            calculation: { type, input: syncedInput }
                                        })}
                                    />
                                )}

                                {!!calculationInput && !calculationInputSyncEnabled && (
                                    <Button
                                        className={'ml-1'}
                                        text={'X'}
                                        type={BUTTON_TYPE.RED_OUTLINE}
                                        onClick={() => setTodData({ calculation: {input: '', type: undefined }})}
                                    />
                                )}
                            </div>
                        )}
                        onChange={(input) => setTodData({ calculation: {input, type: input !== '' ? type : undefined }})}
                        value={!!calculationInput ? Math.abs(calculationInput) : ''}
                        disabled={calculationInputSyncEnabled}
                    />

                    <span className={'w-full inline-block text-center mb-2 last:hidden'}>OR</span>
                </>
            ))}
        </Card>
    );
};

export default connect(
    ({ [TOD_CALCULATOR_REDUCER]: { currentAltitudeMode, calculationInputMode, currentAltitude, targetAltitude, calculation } }) => ({
        currentAltitudeSyncEnabled: currentAltitudeMode === TOD_INPUT_MODE.AUTO,
        calculationInputSyncEnabled: calculationInputMode === TOD_INPUT_MODE.AUTO,
        currentAltitude,
        targetAltitude,
        calculation
    }),
    { setTodCurrentAltitudeSync, setTodData }
)(Data);