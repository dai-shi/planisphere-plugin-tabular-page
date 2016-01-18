/* global TabularPage:true, TabularPageInner:true */
/* global SimpleSchema, Tabular, FS */

TabularPageInner = {};
TabularPageInner.configSub = function() {};
TabularPageInner.Tables = {};
TabularPageInner.getImageTemplate = function() {
  return null;
};

FS.Collection.instanceMap = FS.Collection.instanceMap || {};

TabularPageInner.getCollectionFS = function(collectionName) {
  let cfs = FS.Collection.instanceMap[collectionName];
  if (!cfs) {
    cfs = FS.Collection.instanceMap[collectionName] = new FS.Collection(collectionName, {
      stores: [new FS.Store.GridFS(collectionName)],
      filter: {
        maxSize: 10 * 1024 * 1024
      }
    });
    cfs.allow({
      insert(userId, doc) {
        return !!userId && doc.owner === userId;
      },
      download() {
        return true;
      }
    });
  }
  return cfs;
};

function setupTabular(page) {
  let cfs;
  if (page.fields.find(field => field.type === 'image')) {
    cfs = TabularPageInner.getCollectionFS(page.collection);
  }
  TabularPageInner.Tables[page.name] = new Tabular.Table({
    name: page.name,
    collection: Mongo.Collection.get(page.collection) || new Mongo.Collection(page.collection),
    pub: 'tabular_' + page.collection,
    columns: page.fields.map((field) => {
      if (field.type === 'image') {
        return {
          data: field.name,
          title: field.label,
          tmpl: TabularPageInner.getImageTemplate(page.name, cfs),
          tmplContext: function(rowData) {
            return {
              data: rowData[field.name]
            };
          }
        };
      } else {
        return {
          data: field.name,
          title: field.label
        };
      }
    })
  });
}

TabularPage = TabularPage || {};
TabularPage.config = function(config, isSimulation) {
  if (!isSimulation) {
    // https://github.com/meteor/meteor/issues/3025
    config.pages.forEach(setupTabular);
  }
  TabularPageInner.configSub(config);
};

if (Package['daishi:planisphere-core']) {
  const Planisphere = Package['daishi:planisphere-core'].Planisphere;
  Planisphere.registerPlugin({
    name: 'tabular-page',
    description: 'provides tabular page for main layout',
    configMethod: 'TabularPage.config',
    configSchema: new SimpleSchema({
      pages: {
        type: [new SimpleSchema({
          name: {
            type: String
          },
          label: {
            type: String
          },
          collection: {
            type: String
          },
          fields: {
            minCount: 1,
            type: [new SimpleSchema({
              name: {
                type: String
              },
              label: {
                type: String
              },
              type: {
                type: String,
                allowedValues: ['text', 'image']
              }
            })]
          }
        })]
      }
    })
  });
}
