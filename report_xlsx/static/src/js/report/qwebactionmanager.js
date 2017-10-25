odoo.define('report_xml.report', function(require){
'use strict';

var ActionManager= require('web.ActionManager');
var crash_manager = require('web.crash_manager');
var framework = require('web.framework');

ActionManager.include({
    ir_actions_report: function (action, options){
        var self = this;
        action = _.clone(action);
        if (action.report_type === 'xlsx') {
            framework.blockUI()
            var report_xlsx_url = 'report/xlsx/' + action.report_name;
            if(action.context.active_ids){
                report_xlsx_url += '/' + action.context.active_ids.join(',');
            }
            else{
                report_xlsx_url += '?options=' + encodeURIComponent(JSON.stringify(action.data));
                report_xlsx_url += '&context=' + encodeURIComponent(JSON.stringify(action.context));
            }
            self.getSession().get_file({
                url: report_xlsx_url,
                data: {data: JSON.stringify([
                    report_xlsx_url,
                    action.report_type,
                ])},
                error: crash_manager.rpc_error.bind(crash_manager),
                success: function (){
                    if(action && options && !action.dialog){
                        options.on_close();
                    }
                },
            });
            framework.unblockUI();
            return
        }
        return self._super(action, options);
    }
});
});