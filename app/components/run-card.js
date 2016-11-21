"use strict";

const yerbamate = require('yerbamate');

const taskStatus = {
    idle: "do_not_disturb_off",
    error: "error",
    running: "autorenew",
    ok: "check_circle"
};


Vue.component('run-card', {
    props: ['task', 'title'],
    data: () => {
        return {
            output: [],
            status: taskStatus.idle,
            statusColor: "",
            running: false,
            proc: null
        };
    },
    template: `
    
    <li class="run-card">
        <div class="collapsible-header">
            <span class="badge"><i class="small material-icons" v-bind:style="{color: statusColor}" v-bind:class="{ disabled: running }">{{status}}</i></span>{{title}} 
        </div>
      
    <div class="collapsible-body">
        <a class="waves-effect waves-light btn run-button" v-on:click="run(task)">{{title}}</a>
        <a class="waves-effect waves-light btn run-button" v-on:click="stop(task)" v-bind:class="{ disabled: !running }">Stop</a>
        <div class="run-output">
            <p v-for="log in output">
            {{log}}
            </p>
        </div>
    </div>
  </li>
  `,
    methods: {
        run: function(task) {
            this.status = taskStatus.running;
            this.statusColor = "";
            this.running = true;
            this.output = [];
            this.proc = yerbamate.run(task, ".", {
                    stderr: this.print,
                    stdout: this.print
                },
                (code, out, errs) => {
                    this.running = false;
                    if (!yerbamate.successCode(code)) {
                        this.status = taskStatus.error;
                        this.statusColor = "red";

                    } else {
                        this.status = taskStatus.ok;
                        this.statusColor = "green";
                    }
                    if (errs.length > 0) console.log("Errors in process:" + errs.length);
                });
        },
        stop: function() {
            yerbamate.stop(this.proc);
        },
        print: function(out) {
            this.output.push(out);

        }
    }
});
