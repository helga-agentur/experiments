const context = [];

function subscribe(running, subscriptions) {
    subscriptions.add(running);
    running.dependencies.add(subscriptions);
    console.log('subscribe; running %o sub %o', running, subscriptions);
}

const createSignal = (value) => {

    const subscriptions = new Set();

    const read = () => {
        const running = context[context.length - 1];
        if (running) subscribe(running, subscriptions);
        return value;
    }
    
    const write = (newValue) => {
        value = newValue;
        for (const sub of [...subscriptions]) {
            sub.execute();
        }
    }
    
    return [read, write];

}

const cleanup = (running) => {
    for (const dep of running.dependencies) {
        dep.delete(running);
    }
    running.dependencies.clear();
}

const createEffect = (fn) => {
    const execute = () => {
        console.log('execute', fn);
        cleanup(running);
        context.push(running);
        try {
            fn();
        } finally {
            context.pop();
        }
    }
    const running = {
        execute,
        dependencies: new Set(),
    }

    execute();
}

export { createSignal, createEffect };
