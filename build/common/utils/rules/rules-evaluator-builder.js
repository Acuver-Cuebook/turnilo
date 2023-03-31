"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RulesEvaluatorBuilder {
    constructor(rules, partialRule, otherwiseAction) {
        this.partialRule = partialRule;
        this.otherwiseAction = otherwiseAction;
        this.rules = rules || [];
    }
    static empty() {
        return new RulesEvaluatorBuilder();
    }
    when(predicate) {
        const { rules } = this;
        const partialRule = { predicates: [predicate] };
        return new RulesEvaluatorBuilder(rules, partialRule);
    }
    or(predicate) {
        const { rules, partialRule } = this;
        const newPartialRule = { predicates: [...partialRule.predicates, predicate] };
        return new RulesEvaluatorBuilder(rules, newPartialRule);
    }
    then(action) {
        const { rules, partialRule } = this;
        const newRule = { ...partialRule, action };
        return new RulesEvaluatorBuilder([...rules, newRule]);
    }
    otherwise(action) {
        const { rules } = this;
        return new RulesEvaluatorBuilder(rules, undefined, action);
    }
    build() {
        return (variables) => {
            for (const rule of this.rules) {
                const { predicates, action } = rule;
                if (predicates.some(predicate => predicate(variables))) {
                    return action(variables);
                }
            }
            return this.otherwiseAction(variables);
        };
    }
}
exports.RulesEvaluatorBuilder = RulesEvaluatorBuilder;
//# sourceMappingURL=rules-evaluator-builder.js.map