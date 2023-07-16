import type Borrow from '@nodes/Borrow';
import NodeRef from '@locale/NodeRef';
import type Locale from '@locale/Locale';
import type Evaluator from './Evaluator';
import Exception from './Exception';
import concretize from '../locale/concretize';

export default class CycleException extends Exception {
    readonly borrow: Borrow;

    constructor(evaluator: Evaluator, borrow: Borrow) {
        super(borrow, evaluator);

        this.borrow = borrow;
    }

    getExceptionText(locale: Locale) {
        return locale.node.Borrow.exception.CycleException;
    }

    getExplanation(locale: Locale) {
        return concretize(
            locale,
            this.getExceptionText(locale).explanation,
            new NodeRef(
                this.borrow,
                locale,
                this.evaluator.project.getNodeContext(this.borrow),
                this.borrow.source?.getText()
            )
        );
    }
}
