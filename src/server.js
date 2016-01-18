/* global TabularPageInner */

TabularPageInner.configSub = function(config) {
  config.pages.forEach((page) => {
    Meteor.publishComposite('tabular_' + page.collection, function(tableName, ids, fields) {
      check(tableName, String);
      check(ids, Array);
      check(fields, Match.Optional(Object));

      return {
        find: function() {
          return Mongo.Collection.get(page.collection).find({
            _id: {
              $in: ids
            }
          }, {
            fields: fields
          });
        },
        children: [{
          find: function(item) {
            const ids = [];
            page.fields.find((field) => {
              if (field.type === 'image') {
                ids.push(item[field.name]);
              }
            });
            const cfs = TabularPageInner.getCollectionFS(page.collection);
            return cfs.find({
              _id: {
                $in: ids
              }
            });
          }
        }]
      };
    });
  });
};
