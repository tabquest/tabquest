import prompts from 'prompts';
import { exec } from 'child_process';

const questions = [
    {
        type: 'select',
        name: 'mode',
        message: 'Choose a mode:',
        choices: [
            { title: 'Chrome', value: 'chrome' },
            { title: 'Edge', value: 'edge' },
            { title: 'Firefox', value: 'firefox' }
        ]
    }
];

(async () => {
    const response = await prompts(questions);
    const mode = response.mode;

    if (mode) {
        const child = exec(`npm run ${process.argv[2]}:${mode}`);
        
        child.stdout.on('data', (data) => {
            console.log(data.toString());
        });

        child.stderr.on('data', (data) => {
            console.error(data.toString());
        });

        child.on('close', (code) => {
            console.log(`Process exited with code ${code}`);
        });
    } else {
        console.log('No mode selected, operation cancelled.');
    }
})();
