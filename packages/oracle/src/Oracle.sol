// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

contract Oracle {
  struct Job {
    address to;
    bytes requestData;
  }

  mapping(uint256 => Job) private jobs;

  uint256 jobLength;

  event CreatedJob(uint256 indexed jobId, Job job);
  event CompletedJob(uint256 indexed jobId, Job job, bytes[] dataBytes);

  function execute(bytes memory data) public {
    // TODO: make sure msg.sender is a Contract Address
    address to = msg.sender;
    uint256 jobId = jobLength;

    jobs[jobId] = Job(to, data);

    emit CreatedJob(jobId, jobs[jobId]);

    jobLength++;
  }

  function completeJob(uint256 jobId, bytes[] memory dataBytes) public {
    Job memory job = jobs[jobId];

    for (uint256 i=0; i<dataBytes.length; i++) {
      (bool success, bytes memory data) = job.to.call(dataBytes[i]);

      if (!success) {
        assembly {
          let returndata_size := mload(data)
          revert(add(32, data), returndata_size)
        }
      }
    }

    emit CompletedJob(jobId, jobs[jobId], dataBytes);
  }
}