import Exception from './Exception';
import type Evaluator from './Evaluator';
import type Locale from '@locale/Locale';
import type Expression from '@nodes/Expression';
import NodeRef from '@locale/NodeRef';
import concretize from '../locale/concretize';

export default class ValueException extends Exception {
    readonly expression: Expression;
    constructor(evaluator: Evaluator, expression: Expression) {
        super(expression, evaluator);
        this.expression = expression;
    }

    getExceptionText(locale: Locale) {
        return locale.node.Program.exception.ValueException;
    }

    getExplanation(locale: Locale) {
        return concretize(
            locale,
            this.getExceptionText(locale).explanation,
            new NodeRef(
                this.expression,
                locale,
                this.getNodeContext(this.expression)
            )
        );
    }
}
