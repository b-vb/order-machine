import './styles.css';
import { machine } from './machine';
import { createActor } from 'xstate';

const actor = createActor(machine, {
  input: { order: { state: 'Open', payment: { amount: 100 } } },
});

// actor.subscribe((snapshot) => {
//   console.log('Transition', snapshot)
// });

actor.start();

const handleOrderChanges = () => {
  let currentValue;
  while (true) {
    actor.send({ type: 'order changed' });

    const snapshot = actor.getSnapshot();

    // Check if there are no more valid transitions
    if (snapshot.value === currentValue) {
      break;
    }

    currentValue = snapshot.value;
  }
};

handleOrderChanges();
