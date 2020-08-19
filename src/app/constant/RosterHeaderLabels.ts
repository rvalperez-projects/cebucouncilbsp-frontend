export abstract class RosterHeaderLabels {
    
    public static iSComPositions: Position[] = [
        {code: "00", title: "-Inst’l Scouting Rep."},
        {code: "01", title: "-Parent Representative"},
        {code: "02", title: "-ISC Chair/Coor./Memb."},
        {code: "03", title: "-Inst’l Sctng. Coordinator"},
        {code: "04", title: "Unit Leader/Circle Adviser"},
        {code: "05", title: "Asst. Unit Leader/ACA"},
        {code: "05", title: "Asst. Unit Leader/ACA"}
    ];
    
    public static memberPositions: Position[] = [
        {code: "00", title: "SPL/SCL/RL:"},
        {code: "01", title: "ARL (Circle):"},
        {code: "02", title: "ARL (Circle):"},
        {code: "03", title: "AUDITOR (Circle):"},
        {code: "04", title: "SCRIBE/SECRETARY:"},
        {code: "05", title: "TREASURER:"},
        {code: "06", title: "QUARTERMASTER:"},
        {code: "07", title: "1."},{code: "07", title: "2."},
        {code: "07", title: "3."},{code: "07", title: "4."},
        {code: "07", title: "5."},{code: "07", title: "6."},
        {code: "07", title: "7."},{code: "07", title: "8."},{code: "x", title: ""},
        {code: "07", title: "1."},{code: "07", title: "2."},
        {code: "07", title: "3."},{code: "07", title: "4."},
        {code: "07", title: "5."},{code: "07", title: "6."},
        {code: "07", title: "7."},{code: "07", title: "8."},{code: "x", title: ""},
        {code: "07", title: "1."},{code: "07", title: "2."},
        {code: "07", title: "3."},{code: "07", title: "4."},
        {code: "07", title: "5."},{code: "07", title: "6."},
        {code: "07", title: "7."},{code: "07", title: "8."},{code: "x", title: ""},
        {code: "07", title: "1."},{code: "07", title: "2."},
        {code: "07", title: "3."},{code: "07", title: "4."},
        {code: "07", title: "5."},{code: "07", title: "6."},
        {code: "07", title: "7."},{code: "07", title: "8."}
    ];

    public static registrationStatusCode: Array<string> = ["N","RR"];

    public static highestTraining: Map<string, string> = new Map([
        ["", ""],
        ["00", "Orientation"],
        ["01", "BTC"],
        ["02", "ATC"],
        ["03", "CML"],
        ["04", "CMT"]
    ]);

    public static highestBadge: Map<string, string> = new Map([
        ["", ""],
        ["00", "Membership"],
        ["10", "Young USA"],
        ["11", "Growing USA"],
        ["12", "Leaping USA"],
        ["20", "Tenderfoot"],
        ["21", "Second Class"],
        ["22", "First Class"],
        ["30", "Explorer"],
        ["31", "Pathfinder"],
        ["32", "Outdoorsman"],
        ["33", "Venturer"],
        ["34", "Eagle"],
        ["40", "Yellow Quadrant"],
        ["41", "Green Quadrant"],
        ["42", "Red Quadrant"],
        ["43", "Blue Quadrant"],
        ["44", "Chief Scout's Nation Builder"]
    ]);
    
    public static sectionCodes: Map<string, string> = new Map([
        ["00", "Langkay"],
        ["01", "Kawan"],
        ["02", "Troop"],
        ["03", "Outfit"],
        ["04", "Circle"]
    ]);

    // TODO: Temporary only
    public static unitNumbers: Array<string> = ["", "L-011","K-109","T-327","T-191","S-190","R-33","New"];
}

interface Position {
    code: string,
    title: string
}