import * as data from 'n-common-static-data';

export const demographics = {
    positions: data.demographics.positions.positions.filter(item => item.active),
    responsibilities: data.demographics.responsibilities.responsibilities.filter(item => item.active),
    industries: data.demographics.industries.industries.filter(item => item.active)
};

export const titles = [
    {description: 'Ms', code: 'Ms'},
    {description: 'Miss', code: 'Miss'},
    {description: 'Mrs', code: 'Mrs'},
    {description: 'Mr', code: 'Mr'},
    {description: 'Dr', code: 'Dr'},
    {description: 'Prof', code: 'Prof'},
    {description: 'Sir', code: 'Sir'}
];