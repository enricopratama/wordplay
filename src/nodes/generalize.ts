import type Context from './Context';
import ListType from './ListType';
import MeasurementType from './MeasurementType';
import TextType from './TextType';
import type Type from './Type';
import UnionType from './UnionType';
import Unit from './Unit';

export default function generalize(types: Type, context: Context) {
    // Are all of the types in the union list types? If so, collapse them into a single list type.
    if (types instanceof UnionType) {
        const possible = types.getPossibleTypes(context);
        // All text? Generalize to text.
        if (possible.every((type) => type instanceof TextType))
            types = TextType.make();
        // All numbers with equivalent units? Generalize to a number with the unit.
        else if (possible.every((type) => type instanceof MeasurementType)) {
            const first = possible[0];
            if (first instanceof MeasurementType) {
                if (
                    possible.every(
                        (type) =>
                            type instanceof MeasurementType &&
                            type.unit instanceof Unit &&
                            first.unit instanceof Unit &&
                            type.unit.isEqualTo(first.unit)
                    )
                )
                    types = MeasurementType.make(first.unit);
            }
        } else if (possible.every((type) => type instanceof ListType)) {
            types = ListType.make(
                UnionType.getPossibleUnion(
                    context,
                    (possible as ListType[]).reduce(
                        (all: Type[], type) =>
                            type.type ? [...all, type.type] : all,
                        []
                    )
                )
            );
        }
    } else if (types instanceof TextType) types = TextType.make();
    else if (types instanceof MeasurementType) types = MeasurementType.make();

    return types;
}