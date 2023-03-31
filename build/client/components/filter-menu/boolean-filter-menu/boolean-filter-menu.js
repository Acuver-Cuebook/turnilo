"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const immutable_1 = require("immutable");
const react_1 = __importDefault(require("react"));
const filter_clause_1 = require("../../../../common/models/filter-clause/filter-clause");
const stage_1 = require("../../../../common/models/stage/stage");
const constants_1 = require("../../../config/constants");
const api_context_1 = require("../../../views/cube-view/api-context");
const bubble_menu_1 = require("../../bubble-menu/bubble-menu");
const button_1 = require("../../button/button");
const checkbox_1 = require("../../checkbox/checkbox");
const loader_1 = require("../../loader/loader");
const query_error_1 = require("../../query-error/query-error");
require("./boolean-filter-menu.scss");
class BooleanFilterMenu extends react_1.default.Component {
    constructor() {
        super(...arguments);
        this.state = this.initialValues();
        this.onOkClick = () => {
            if (!this.actionEnabled())
                return;
            const { saveClause, onClose } = this.props;
            saveClause(this.constructClause());
            onClose();
        };
        this.onCancelClick = () => {
            const { onClose } = this.props;
            onClose();
        };
        this.selectValue = (value) => {
            const { selectedValues } = this.state;
            const newSelection = selectedValues.has(value) ? selectedValues.remove(value) : selectedValues.add(value);
            this.setState({ selectedValues: newSelection });
        };
        this.renderRow = (value) => {
            const { selectedValues } = this.state;
            return react_1.default.createElement("div", { className: "row", key: String(value), title: String(value), onClick: () => this.selectValue(value) },
                react_1.default.createElement("div", { className: "row-wrapper" },
                    react_1.default.createElement(checkbox_1.Checkbox, { selected: selectedValues.has(value) }),
                    react_1.default.createElement("span", { className: "label" }, String(value))));
        };
    }
    initialValues() {
        const { essence: { filter }, dimension } = this.props;
        const clause = filter.getClauseForDimension(dimension);
        if (!clause) {
            return { selectedValues: immutable_1.Set.of(), values: [] };
        }
        if (!(clause instanceof filter_clause_1.BooleanFilterClause)) {
            throw new Error(`Expected boolean filter clause, got: ${clause}`);
        }
        return { selectedValues: clause.values, values: [] };
    }
    componentDidMount() {
        this.fetchData();
    }
    fetchData() {
        const { booleanFilterQuery } = this.context;
        const { essence, dimension } = this.props;
        this.setState({ loading: true });
        booleanFilterQuery(essence, dimension)
            .then((dataset) => {
            this.setState({
                loading: false,
                values: dataset.data.map(d => d[dimension.name]),
                error: null
            });
        }, error => {
            this.setState({
                loading: false,
                values: [],
                error
            });
        });
    }
    constructClause() {
        const { selectedValues } = this.state;
        if (selectedValues.isEmpty())
            return null;
        const { dimension } = this.props;
        return new filter_clause_1.BooleanFilterClause({
            reference: dimension.name,
            values: selectedValues
        });
    }
    actionEnabled() {
        const { essence: { filter }, dimension } = this.props;
        const newClause = this.constructClause();
        const oldClause = filter.getClauseForDimension(dimension);
        return newClause && !newClause.equals(oldClause);
    }
    render() {
        const { onClose, containerStage, openOn } = this.props;
        const { values, error, loading } = this.state;
        return react_1.default.createElement(bubble_menu_1.BubbleMenu, { className: "boolean-filter-menu", direction: "down", containerStage: containerStage, stage: stage_1.Stage.fromSize(250, 210), openOn: openOn, onClose: onClose },
            react_1.default.createElement("div", { className: "menu-table" },
                react_1.default.createElement("div", { className: "rows" }, values.map(this.renderRow)),
                error && react_1.default.createElement(query_error_1.QueryError, { error: error }),
                loading && react_1.default.createElement(loader_1.Loader, null)),
            react_1.default.createElement("div", { className: "ok-cancel-bar" },
                react_1.default.createElement(button_1.Button, { type: "primary", title: constants_1.STRINGS.ok, onClick: this.onOkClick, disabled: !this.actionEnabled() }),
                react_1.default.createElement(button_1.Button, { type: "secondary", title: constants_1.STRINGS.cancel, onClick: this.onCancelClick })));
    }
}
exports.BooleanFilterMenu = BooleanFilterMenu;
BooleanFilterMenu.contextType = api_context_1.ApiContext;
//# sourceMappingURL=boolean-filter-menu.js.map