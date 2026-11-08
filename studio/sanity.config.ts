import {defineConfig} from 'sanity';
import {structureTool} from 'sanity/structure';
import {schemaTypes} from './schemas';
export default defineConfig({
 name:'livediscover',title:'LiveDiscover — The editor’s room',
 projectId:process.env.SANITY_STUDIO_PROJECT_ID||process.env.PUBLIC_SANITY_PROJECT_ID||'',
 dataset:process.env.SANITY_STUDIO_DATASET||'production',
 plugins:[structureTool({structure:S=>S.list().title('LiveDiscover').items([
  S.listItem().title('Events').child(S.list().title('Events').items([
   S.listItem().title('Upcoming').child(S.documentList().title('Upcoming shows').filter('_type == "event" && startDateTime > now()').defaultOrdering([{field:'startDateTime',direction:'asc'}])),
   S.listItem().title('Past').child(S.documentList().title('Past shows').filter('_type == "event" && startDateTime < now()').defaultOrdering([{field:'startDateTime',direction:'desc'}])),
   S.listItem().title('Drafts').child(S.documentList().title('Drafts').filter('_type == "event" && _id in path("drafts.**")')),
  ])),
  S.listItem().title('Submissions').child(S.documentList().title('Submissions').filter('_type == "eventSubmission"').defaultOrdering([{field:'reviewStatus',direction:'desc'}])),
  ...S.documentTypeListItems().filter(i=>!['event','eventSubmission','siteSettings'].includes(i.getId()!)),
  S.divider(),S.listItem().title('Site settings').child(S.document().schemaType('siteSettings').documentId('siteSettings')),
 ])})],schema:{types:schemaTypes},
});
