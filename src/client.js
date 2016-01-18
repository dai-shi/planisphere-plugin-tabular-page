/* global TabularPageInner */

const templateStr = `
<div class="container">
  <h2>{{label}}</h2>
  {{> tabular table=table class="table table-striped table-bordered table-condensed"}}
</div>
`;

const imageTemplateStr = `
<img src="{{image.url}}" />
`;

const imageTemplateMap = {};
TabularPageInner.getImageTemplate = function(name, cfs) {
  let t = imageTemplateMap[name];
  if (!t) {
    t = imageTemplateMap[name] = Template.fromString(imageTemplateStr);
    t.helpers({
      image: function() {
        return cfs.findOne({_id: this.data});
      }
    });
  }
  return t;
};

TabularPageInner.configSub = function(config) {
  config.pages.forEach((page) => {
    let t = Template[page.name];
    if (!t) {
      t = Template[page.name] = Template.fromString(templateStr);
      t.state = t.state || new ReactiveDict();
      t.helpers({
        label() {
          return t.state.get('label');
        },
        table() {
          return TabularPageInner.Tables[page.name];
        }
      });
    }
    t.state.set('label', page.label);
  });
};
