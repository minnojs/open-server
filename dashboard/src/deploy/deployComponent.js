import studyFactory from '../study/files/fileCollectionModel';
export default deployDialog;

import {print_rules} from '../ruletable/ruletableActions';

import {deploy} from './deployModel';
import classNames from 'utils/classNames';
import {get_rules} from '../ruletable/ruletableModel';

const ASTERISK = m('span.text-danger.font-weight-bold', '* ');

let deployDialog = {
    controller(){
        let ctrl = {
            study: {},
            versions:m.prop(),
            version:'',
            version_id:'',
            latest_version:{},
            exps : [],
            sent:false,
            error: m.prop(''),
            target_number: m.prop(''),
            all_rules: m.prop([]),
            sets: m.prop([{rules: '', experiment_file: '', target_number:'', priority:26}]),
            add_set,
            remove_rule,
            update_rule,
            update_version,
            update_priority,
            update_target_number,
            update_experiment_file,
            print_rules,
            check_sets_validity,
            check_form_validity,
            loaded: m.prop(false),

            approved_by_irb: m.prop(false),

            zero_unnecessary_files: m.prop(false),
            completed_checklist: m.prop(false),
            real_start: m.prop(false),

            launch_confirmation: m.prop(''),
            planned_procedure :  m.prop(''),
            sample_size :  m.prop(''),
            comments: m.prop('')
        };



        function check_sets_validity(){
            return ctrl.sets().filter(set=>set.experiment_file==='' || set.target_number ==='' || set.priority==='').length>0;
        }

        function check_form_validity(){
            return  ctrl.check_sets_validity() ||
                    !ctrl.zero_unnecessary_files() ||
                    !ctrl.completed_checklist() ||
                    !ctrl.approved_by_irb() ||
                    !ctrl.real_start() ||
                    !ctrl.planned_procedure() ||
                    !ctrl.sample_size() ||
                    ctrl.launch_confirmation()==='';
        }

        function update_rule(set_id, rule_id){
            ctrl.sets()[set_id].rules = rule_id==='' ? '' : ctrl.all_rules().find(rule=>rule.id===rule_id);
        }
        function update_experiment_file(set_id, experiment_file){
            ctrl.sets()[set_id].experiment_file = ctrl.version.experiments.find(exp=>exp.id===experiment_file);
        }

        function update_priority(set_id, priority){
            ctrl.sets()[set_id].priority = priority;
        }

        function update_version(version_id){
            ctrl.version_id = version_id;
            ctrl.version = ctrl.study.versions.find(version=>version.hash === version_id);
            ctrl.exps = ctrl.version.experiments;
        }

        function update_target_number(set_id, target_number){
            ctrl.sets()[set_id].target_number = target_number;
        }

        function remove_rule(set_id){
            ctrl.sets(ctrl.sets().filter((set, id)=>id!==set_id));
        }

        function add_set(){
            ctrl.sets().push({rules: '', experiment_file: '', target_number:'', priority:26});
        }

        function load() {
            ctrl.study = studyFactory(m.route.param('studyId'));
            return ctrl.study.get()
                .then(()=>{
                    get_rules()
                        .then(response => ctrl.all_rules(response.sets ? response.sets : []))
                        .then(()=> {
                            ctrl.versions(ctrl.study.versions);
                            ctrl.version = ctrl.study.versions[ctrl.study.versions.length - 1];
                            ctrl.version_id = ctrl.version.hash;
                            ctrl.exps = ctrl.version.experiments;
                        })
                        .then(()=>ctrl.loaded(true))
                        .then(m.redraw);
                });
        }
        load();
        return {ctrl, submit};

        function submit(){
            return check_form_validity() ? false :
                deploy(ctrl.study.id, ctrl)
                    .then(() => {
                        ctrl.sent = true;
                    })
                    .catch(response => {
                        ctrl.error(response.message);
                    })
                .then(m.redraw);
        }
    },
    view({ctrl, submit}){
        if (ctrl.sent) return m('.deploy.centrify',[
            m('i.fa.fa-thumbs-up.fa-5x.m-b-1'),
            m('h5', ['The Deploy form was sent successfully ', m('a', {href:'/properties/'+ctrl.study.id, config: m.route}, 'Back to study')]),
        ]);
        return !ctrl.loaded()
            ?
            m('.loader')
            :
            m('.deploy.container', [
                m('.row',[
                    m('.col-sm-12', [
                        m('h3', [
                            'Request Deploy ',
                            m('small', `${ctrl.study.name}`)
                        ]),
                    ])
                ]),
                m('.row.space',[
                    m('.col-sm-2',[
                        ASTERISK, 'Version '
                    ])
                ]),

                m('.row',[
                    m('.col-sm-2',[
                        m('select.c-select.form-control.space',{onchange: e=>ctrl.update_version(e.target.value)}, [
                            m('option', {value:'', selected:ctrl.version_id==='', disabled:true}, 'Select version'),
                            ctrl.versions().map(version=>m('option', {value:version.hash, selected:ctrl.version_id===version.hash}, 'v'+version.id)),
                        ])
                    ])
                ]),

                m('.row.space',[
                    m('.col-sm-12',[
                        m('hr')
                    ])
                ]),

                m('.row.space',[
                    m('.col-sm-1', ''),


                    m('.col-sm-2',[
                        ASTERISK, m('strong.space', 'Experiment File')
                    ]),
                    m('.col-sm-2',[
                        ASTERISK, m('strong.space', 'Target Number of Completed Study Sessions')]),
                    m('.col-sm-2',[
                        ASTERISK, m('strong.space', 'Priority')
                    ]),
                    m('.col-sm-2',[
                        m('strong.space', 'Rule set'),
                        m('p.small.text-muted', ['Create and edit rules sets ',
                            m('a', {href:'?/ruletable', target:'_blank'}, 'Here')
                        ])
                    ]),
                    m('.col-sm-3',[
                        m('strong.space', 'Summary of Rule Logic')
                    ]),
                ]),
                ctrl.sets().map((set, set_id) =>
                    m('.row.space',[
                        m('.col-sm-1',
                            m('',
                                ctrl.sets().length === 1 ? '' : m('a.btn.btn-secondary', {onclick: ()=>ctrl.remove_rule(set_id)}, m('i.fa.fa-times'))
                            )
                        ),
                        m('.col-sm-2',[
                            m('select.c-select.form-control.space',{ onchange: e => {ctrl.update_experiment_file(set_id, e.target.value);}}, [
                                ctrl.exps.length===1 ? ctrl.update_experiment_file(set_id, ctrl.exps[0].id) :
                                    m('option', {value: '', selected:set.experiment_file=== '', disabled:true}, 'Select experiment file'),
                                ctrl.exps.map(file=>
                                    m('option', {value:file.id, selected:set.experiment_file.id===file.id}, file.descriptive_id)
                                )
                            ])
                        ]),
                        m('.col-sm-2',[
                            m('input.form-control.space', {value: set.target_number,  type:'number', min:'0', placeholder:'Target Number', oninput: e => {ctrl.update_target_number(set_id, e.target.value);}})
                        ]),
                        m('.col-sm-2',[
                            m('input.form-control.space', {value: set.priority, type:'number', min:'0', max:'26', placeholder:'Priority', oninput: e => {ctrl.update_priority(set_id, e.target.value);}})
                        ]),
                        m('.col-sm-2',[
                            m('select.c-select.form-control.space',{onchange: e => {ctrl.update_rule(set_id, e.target.value);}}, [
                                m('option', {value:''}, 'None'),
                                ctrl.all_rules().map(rule=>m('option', {value:rule.id}, rule.name))
                            ])
                        ]),
                        m('.col-sm-3',[
                            m('',
                                set.rules==='' ? 'None' :   ctrl.print_rules(set.rules)
                            )
                        ])
                    ])
                ),
                ctrl.sets() === 1 ? '' : m('.row.double_space',[
                    m('.col-sm-12.text-sm-right',[
                        m('button.btn.btn-primary', {disabled: ctrl.check_sets_validity(), onclick: ()=>ctrl.add_set()}, 'Add set')
                    ])
                ]),
                m('.row.space',[
                    m('.col-sm-12',[
                        m('hr')
                    ])
                ]),

                m('.row.space',[
                    m('.col-sm-12',[
                        m('.font-weight-bold', 'Study is ready for deploy: ')
                    ])
                ]),

                m('.row.space',[
                    m('.col-sm-12',{onclick: () => ctrl.approved_by_irb(!ctrl.approved_by_irb())},[
                        ASTERISK, m('i.fa.fa-fw', {
                            class: classNames({'fa-square-o' : !ctrl.approved_by_irb(), 'fa-check-square-o' : ctrl.approved_by_irb()})
                        }), 'This study has been approved by the appropriate IRB '

                    ])
                ]),
                m('.row.space',[
                    m('.col-sm-12',{onclick: () => ctrl.completed_checklist(!ctrl.completed_checklist())},[
                        ASTERISK, m('i.fa.fa-fw', {
                            class: classNames({'fa-square-o' : !ctrl.completed_checklist(), 'fa-check-square-o' : ctrl.completed_checklist()})
                        }), 'The study is compliant with ',
                        m('a', {href:'https://docs.google.com/document/d/1pglAQELqNLWbV1yscE2IVd7G5xVgZ8b4lkT8PYeumu8/edit?usp=sharing', target:'_blank'}, 'PI Research Pool Guidelines and Required Elements & Study Conventions'),
                        ' .'
                    ])
                ]),

                m('.row.space',[
                    m('.col-sm-12',{onclick: () => ctrl.zero_unnecessary_files(!ctrl.zero_unnecessary_files())},[
                        ASTERISK, m('i.fa.fa-fw', {
                            class: classNames({'fa-square-o' : !ctrl.zero_unnecessary_files(), 'fa-check-square-o' : ctrl.zero_unnecessary_files()})
                        }), 'My study folder includes ZERO files that aren\'t necessary for the study (e.g., word documents, older versions of files, items that were dropped from the final version)'

                    ])
                ]),

                m('.row.space',[
                    m('.col-sm-12',{onclick: () => ctrl.real_start(!ctrl.real_start())},[
                        ASTERISK, m('i.fa.fa-fw', {
                            class: classNames({'fa-square-o' : !ctrl.real_start(), 'fa-check-square-o' : ctrl.real_start()})
                        }), 'I used a realstart and lastpage tasks'

                    ])
                ]),


                m('.row.space',[
                    m('.col-sm-12',[
                        ASTERISK, 'If you are building this study for another researcher (e.g. a contract study), has the researcher received the standard final launch confirmation email and confirmed that the study is ready to be launched? '
                    ])
                ]),

                m('.row',[
                    m('.col-sm-5',[
                        m('select.c-select.form-control.space',{onchange: m.withAttr('value', ctrl.launch_confirmation)}, [
                            m('option', {value:'', selected:ctrl.launch_confirmation()==='', disabled:true}, 'Select answer'),
                            m('option', {value:'No,this study is mine', selected:ctrl.launch_confirmation()==='No,this study is mine'}, 'No,this study is mine'),
                            m('option', {value:'Yes', selected:ctrl.launch_confirmation()==='yes'}, 'Yes'),
                        ])
                    ])
                ]),
                m('.row.space',[
                    m('.col-sm-12',[
                        ASTERISK,
                        'Planned Procedure',
                        m('p.small.text-muted', '(if it\'s an extension of a prior approved study, make sure to explicitly describe how it is different from the previous approved study)')
                    ])
                ]),

                m('.row',[
                    m('.col-sm-12',[
                        m('textarea.form-control', {value: ctrl.planned_procedure(), oninput:  m.withAttr('value', ctrl.planned_procedure), placeholder:'Planned Procedure'})
                    ])
                ]),

                m('.row.space',[
                    m('.col-sm-12',[
                        ASTERISK,
                        'Planned Sample Size and Justification'
                    ])
                ]),

                m('.row',[
                    m('.col-sm-12',[
                        m('textarea.form-control', {value: ctrl.sample_size(), oninput:  m.withAttr('value', ctrl.sample_size), placeholder:'Planned Sample Size and Justification'})
                    ])
                ]),

                m('.row.space',[
                    m('.col-sm-12',[
                        'Additional comments'
                    ])
                ]),

                m('.row',[
                    m('.col-sm-12',[
                        m('textarea.form-control', {value: ctrl.comments(), oninput:  m.withAttr('value', ctrl.comments), placeholder:'Additional comments'})
                    ])
                ]),

                !ctrl.error() ? '' : m('.alert.alert-danger', m('strong', 'Error: '), ctrl.error()),
                m('.row.space',[
                    m('.col-sm-12.text-sm-right',[
                        m('button.btn.btn-secondary', {onclick:()=>m.route( `/properties/${ctrl.study.id}`)}, 'Cancel'),
                        m('button.btn.btn-primary', {disabled: ctrl.check_form_validity(), onclick: submit}, 'Request Deploy'),
                        !ctrl.check_form_validity() ? '' : m('p.small.text-danger.font-weight-bold', 'All mandatory fields have to be filled')
                    ])
                ]),
            ]);
    }
};