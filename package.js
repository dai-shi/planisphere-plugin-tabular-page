Package.describe({
  name: 'daishi:planisphere-plugin-tabular-page',
  version: '0.0.1',
  summary: 'Tabular page plugin for Planisphere (used with MainLayout)',
  git: 'https://github.com/dai-shi/planisphere-plugin-tabular-page',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');
  api.use(['ecmascript', 'templating', 'reactive-dict', 'check']);
  api.use('aldeed:simple-schema@1.1.0');
  api.use('numtel:template-from-string@0.1.0');
  api.use('dburles:mongo-collection-instances@0.3.5');
  api.use('aldeed:tabular@1.6.0');
  api.use('cfs:standard-packages@0.5.9');
  api.use('cfs:gridfs@0.0.33');
  api.use('reywood:publish-composite@1.4.2');
  api.use('daishi:planisphere-core@0.1.0');
  api.addFiles(['src/common.js']);
  api.addFiles(['src/client.js'], 'client');
  api.addFiles(['src/server.js'], 'server');
  api.export('TabularPage');
});

Package.onTest(function(api) {
  api.use(['ecmascript', 'templating', 'reactive-dict', 'check']);
  api.use('tinytest');
  api.use('daishi:planisphere-plugin-tabular-page');
  api.addFiles(['tests/common-tests.js']);
});
