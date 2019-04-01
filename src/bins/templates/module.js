import { ModuleCreator } from '@timeforyou/maslow';
import api from '../api';


const __myModuleName__Module = ModuleCreator('__myCapitalizedModuleName__', {
  getList: () => api.__myModuleName__.get(),
  getDetail: id => api.__myModuleName__.id(id).get(),
  update: (id, body) => api.__myModuleName__.id(id).put(body),
  delete: id => api.__myModuleName__.id(id).delete(),
  create: body => api.__myModuleName__.post(body),
});

export default __myModuleName__Module;
