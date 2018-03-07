
export const filterDemographicsLists = rawLists => ({
    positions: rawLists.positions.filter(item => item.active),
    responsibilities: rawLists.responsibilities.filter(item => item.active),
    industries: rawLists.industries.filter(item => item.active)
});

export const titles = [
    {description: 'Ms', code: 'Ms'},
    {description: 'Miss', code: 'Miss'},
    {description: 'Mrs', code: 'Mrs'},
    {description: 'Mr', code: 'Mr'},
    {description: 'Dr', code: 'Dr'},
    {description: 'Prof', code: 'Prof'},
    {description: 'Sir', code: 'Sir'}
];