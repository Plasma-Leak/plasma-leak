import {
  parse,
  compile,
  simplify,
  derivative,
  MathNode,
  EvalFunction,
} from "mathjs";
export class Func {
  expression: MathNode;
  compiled: EvalFunction;

  constructor(expression: string) {
    this.expression = parse(expression);
    this.compiled = compile(expression);
  }

  add(f: Func): Func {
    return new Func(
      simplify("(" + this.expression + ") + (" + f.expression + ")").toString()
    );
  }

  sub(f: Func): Func {
    return new Func(
      simplify("(" + this.expression + ") - (" + f.expression + ")").toString()
    );
  }

  multiply(f: Func): Func {
    return new Func(
      simplify("(" + this.expression + ") * (" + f.expression + ")").toString()
    );
  }

  divide(f: Func): Func {
    return new Func(
      simplify("(" + this.expression + ") / (" + f.expression + ")").toString()
    );
  }

  derivative(symbol: string): Func {
    return new Func(derivative(this.expression, symbol).toString());
  }

  evaluate(scope: object): number {
    return this.compiled.evaluate(scope);
    // return this.expression.evaluate(scope)
  }
}
