export abstract class RosterHeaderLabels {
    
    public static iSComPositions: Array<string> = [
        "-Inst’l Scouting Rep.",
        "-Parent Representative",
        "-ISC Chair/Coor./Memb.",
        "-Inst’l Sctng. Coordinator",
        "Unit Leader/Circle Adviser",
        "Asst. Unit Leader/ACA",
        "Asst. Unit Leader/ACA"
    ];
    
    public static memberPositions: Array<string> = [
        "SPL/SCL/RL:",
        "ARL (Circle):",
        "ARL (Circle):",
        "AUDITOR (Circle):",
        "SCRIBE/SECRETARY:",
        "TREASURER:",
        "QUARTERMASTER:",
        "1.","2.","3.","4.","5.","6.","7.","8.","",
        "1.","2.","3.","4.","5.","6.","7.","8.","",
        "1.","2.","3.","4.","5.","6.","7.","8.","",
        "1.","2.","3.","4.","5.","6.","7.","8.",""
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