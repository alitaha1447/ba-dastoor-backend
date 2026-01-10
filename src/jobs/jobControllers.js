const express = require('express');
const Job = require('../jobs/jobModel');

module.exports = {
    // create a job
    createJob: async (req, res) => {
        try {
            const { jobTitle, description, location, experience, status } = req.body;

            if (!jobTitle) {
                return res.status(400).json({ message: "Job title is required" })
            }

            const job = await Job.create({
                jobTitle, description, location, experience, status
            })

            res.status(201).json({ success: true, message: "Job created successfully", data: job });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Failed to create job",
                error: error.message
            });
        }
    },
    // get all job
    getJob: async (req, res) => {
        try {
            const jobs = await Job.find();
            res.status(200).json({
                success: true,
                data: jobs
            })
        } catch (error) {
            res.status(500).json({ success: false, message: "Failed to fetch jobs" });
        }
    },
    // update job by id
    editJobById: async (req, res) => {
        try {
            const job = await Job.findByIdAndUpdate(req?.params?.id, {
                ...req?.body,
                updatedAt: Date.now(),
            }, { new: true });
            res.status(201).json({
                message: "Job Updated Successfully",
                data: job,
            });

        } catch (error) {
            res.status(500).json({ success: false, message: "Failed to update job" });
        }

    },
    // delete job by id
    deleteJobById: async (req, res) => {
        console.log(req.params.id)
        let id = req?.params?.id
        try {
            const job = await Job.findByIdAndDelete({ _id: id })
            res.status(201).json({
                message: "Job Deleted Successfully",
                data: job,
            });
        } catch (error) {
            res.status(500).json({ message: error });
        }
    }
}