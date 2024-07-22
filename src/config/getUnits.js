import convert from 'convert-units';

const getUnits = () => {
    const unitTypes = [
        'length',
        'mass',
        'volume',
        'temperature',
        'time',
        'digital',
        'frequency',
        'speed',
        'pace',
        'pressure',
        'current',
        'voltage',
        'power',
        'energy',
        'reactiveEnergy',
        'reactivePower',
        'apparentPower',
        'charge',
        'force',
        'area'
    ];

    const units = unitTypes.reduce((acc, type) => {
        acc[type] = convert().possibilities(type);
        return acc;
    }, {});

    return units;
};

export default getUnits;