import { assign, createMachine } from 'xstate';

type Payment = {
  amount: number;
};

type Invoice = {
  amount: number;
};

type Order = {
  state: 'Open' | 'Confirmed' | 'Completed';
  payment?: Payment;
  invoice?: Invoice;
};

type Transition = {
  from: string;
  to: string;
};

export const machine = createMachine(
  {
    id: 'order',
    initial: 'Open',
    types: {} as {
      input: {
        order: Order;
      };
      context: {
        order: Order;
        transitions: Transition[];
      };
      events: { type: 'order changed' };
    },
    context: ({ input }) => ({
      order: input.order,
      transitions: [],
    }),
    states: {
      Open: {
        on: {
          'order changed': {
            target: 'Confirmed',
            guard: 'hasPayment',
            actions: 'addTransition',
          },
        },
      },
      Confirmed: {
        on: {
          'order changed': {
            target: 'Completed',
            guard: 'hasInvoice',
            actions: 'addTransition',
          },
        },
      },
      Completed: {},
    },
  },
  {
    guards: {
      hasPayment: ({ context }) => context.order.payment !== undefined,
      hasInvoice: ({ context }) => context.order.invoice !== undefined,
    },
    actions: {
      addTransition: assign({
        transitions: ({ context, event }) => {
          console.log(event);
          return [
            ...context.transitions,
            { from: context.order.state, to: 'unknown' },
          ];
        },
      }),
    },
  }
);
