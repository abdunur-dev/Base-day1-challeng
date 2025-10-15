// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title BaseHealth
 * @dev Decentralized health records management on Base blockchain
 * @notice Store encrypted health record hashes and manage access control
 */
contract BaseHealth {
    struct Record {
        string hash;
        uint256 timestamp;
    }

    // Mapping from patient address to their health records
    mapping(address => Record[]) public records;

    // Mapping for access control: patient => doctor => hasAccess
    mapping(address => mapping(address => bool)) public sharedAccess;

    // Events
    event RecordSaved(address indexed patient, string hash, uint256 timestamp);
    event AccessShared(address indexed patient, address indexed doctor);
    event AccessRevoked(address indexed patient, address indexed doctor);

    /**
     * @dev Save a new health record hash
     * @param _hash The SHA-256 hash of the encrypted health record
     */
    function saveRecord(string memory _hash) public {
        records[msg.sender].push(Record(_hash, block.timestamp));
        emit RecordSaved(msg.sender, _hash, block.timestamp);
    }

    /**
     * @dev Grant access to a doctor to view your records
     * @param _doctor The wallet address of the healthcare provider
     */
    function shareAccess(address _doctor) public {
        require(_doctor != address(0), "Invalid doctor address");
        require(_doctor != msg.sender, "Cannot share with yourself");
        sharedAccess[msg.sender][_doctor] = true;
        emit AccessShared(msg.sender, _doctor);
    }

    /**
     * @dev Revoke access from a doctor
     * @param _doctor The wallet address of the healthcare provider
     */
    function revokeAccess(address _doctor) public {
        sharedAccess[msg.sender][_doctor] = false;
        emit AccessRevoked(msg.sender, _doctor);
    }

    /**
     * @dev Get all records for a patient (requires access)
     * @param _patient The patient's wallet address
     * @return Array of health records
     */
    function getRecords(address _patient) public view returns (Record[] memory) {
        require(
            msg.sender == _patient || sharedAccess[_patient][msg.sender],
            "No access to these records"
        );
        return records[_patient];
    }

    /**
     * @dev Get the number of records for a patient
     * @param _patient The patient's wallet address
     * @return Number of records
     */
    function getRecordCount(address _patient) public view returns (uint256) {
        require(
            msg.sender == _patient || sharedAccess[_patient][msg.sender],
            "No access to these records"
        );
        return records[_patient].length;
    }

    /**
     * @dev Check if a doctor has access to patient records
     * @param _patient The patient's wallet address
     * @param _doctor The doctor's wallet address
     * @return Boolean indicating access status
     */
    function hasAccess(address _patient, address _doctor) public view returns (bool) {
        return sharedAccess[_patient][_doctor];
    }
}
