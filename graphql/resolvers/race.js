//Requires from the project
const Race = require('../../models/race');
const Post = require('../../models/post');
const { transformRace } = require('./merge');

module.exports = {
    //query for all categories
    races: async () => {
        try {
            const races = await Race.find();
            return races.map(race => {
                return race;
            })
        } catch (err) {
            throw err;
        }
    },
    raceData: async (args) => {
        try {
            const race = await Race.findOne({ name: args.name });
            const transformedRace = transformRace(race);

            return transformedRace;
        } catch (err) {
            throw err;
        }
    },
    //mutation for create categories
    createRace: async (args, req) => {
        if (!req.isAuth && !req.userRol === 'Admin') {
            throw new Error('You don\'t have permission to do that');
        }
        const races = await Race.find();
        const existingRace = await Race.findOne({ name: args.raceInput.name });

        if (existingRace) {
            throw new Error('Category exists already.');
        }

        const race = new Race({
            name: args.raceInput.name,
            description: args.raceInput.description,
            icon: args.raceInput.icon,
        });
        try {
            const result = await race.save();
            return race;
        } catch (err) {
            throw err;
        }
    },
}