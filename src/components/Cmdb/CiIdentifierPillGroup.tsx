import * as React from "react";
import { PillGroup } from "azure-devops-ui/PillGroup";
import { Pill } from "azure-devops-ui/Pill";

import "./CiIdentifierPillGroup.css";

const CiIdentifierPillGroup = ({
    ciIdentifiers
}: {
    ciIdentifiers: string;
}) => (
    <div className="ci-identifiers">
        <label className="ci-identifiers-label">CI identifiers: </label>
        <PillGroup className="ci-identifiers-pillgroup">
            {ciIdentifiers.split(",").map(id => (
                <Pill
                    key={id.trim()}
                    color={{
                        red: 182,
                        green: 15,
                        blue: 160
                    }}
                    variant={2}
                >
                    {id.trim()}
                </Pill>
            ))}
        </PillGroup>
    </div>
);

export default CiIdentifierPillGroup;
