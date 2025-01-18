/**
 * CPU Simulator
 */

const INSTRUCTIONS = {
  0x01: {
    name: "LOAD",
    execute: (cpu, mem, operand) => {
      cpu.registers.A = mem.read(operand);
      console.log(`Loaded value ${cpu.registers.A} into register A`);
    },
  },
  0x02: {
    name: "STORE",
    execute: (cpu, mem, operand) => {
      cpu.registers.B = mem.write(operand);
    },
  },
};

/**
 * If only I had used the word Index instead of Address and Array instead of Memory,
 * my brain would have found it easier to reason about the working here. I made it
 * difficult for myself. :\
 */

class Clock {
  constructor() {
    this.frequency = 1; // 1Hz
    this.intervalId = null;
  }

  start(callback) {
    this.intervalId = setInterval(callback, 1000 / this.frequency);
  }

  stop() {
    clearInterval(this.intervalId);
  }
}

class Memory {
  constructor(size = 16) {
    this.size = size;
    this.data = new Uint8Array(this.size);
  }

  read(address) {
    if (address < 0 || address > this.size) {
      throw new Error("Memory access out of bounds");
    }
    return this.data[address];
  }

  write(address, value) {
    if (address < 0 || address >= this.size) {
      throw new Error("Memory access out of bounds");
    }
    this.data[address] = value;
  }

  dump() {}
}

class ALU {
  constructor() {
    this.result = 0;
  }

  ADD(a, b) {
    this.result = a + b;
  }
  SUB(a, b) {
    this.result = a - b;
  }
  AND(a, b) {}
  OR(a, b) {}
}

class CPU {
  constructor() {
    this.flags = {
      zero: false,
      carry: false,
      overflow: false,
    };
  }

  registers = { A: 0, B: 0, C: 0, D: 0, PC: 0, SP: 0 };
  alu = new ALU();
  flags = this.flags;

  fetch() {
    return this.registers.PC;
  }

  decode(instruction) {
    console.log(INSTRUCTIONS[instruction].name);
  }

  execute(instruction, operand, memory) {
    const operation = INSTRUCTIONS[instruction];
    if (operation) {
      operation.execute(this, memory, operand);
    } else {
      throw new Error(`Invalid instruction: 0x${instruction.toString(16)}`);
    }
  }

  step(memory) {
    for (let i = 0; i < memory.length; i++) {}
  }
}

/**
 * Class Simulator should initialize everything starting with a CPU,
 * then the memory.
 */
class Simulator {
  constructor() {
    this.memory = new Memory(16);
    this.cpu = new CPU();
    this.clock = new Clock();
  }

  loadProgram(program) {
    for (let i = 0; i < program.length; i++) {
      this.memory.write(i, program[i]);
    }
  }

  run() {
    this.clock.start(() => {
      this.cpu.step(this.memory);
    });
  }

  stop() {
    this.clock.stop();
  }
}

const program = [0x01, 0x05, 0x02, 0x00]; // LOAD A, 5; STORE A, 0;
const sim = new Simulator();
sim.loadProgram(program);
sim.run();
