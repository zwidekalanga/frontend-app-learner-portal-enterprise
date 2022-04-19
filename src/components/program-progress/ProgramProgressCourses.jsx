import React, { useContext } from 'react';

import PropTypes from 'prop-types';
import {
  Form, Col, Row,
} from '@edx/paragon';
import moment from 'moment';
import { CheckCircle } from '@edx/paragon/icons';
import { AppContext } from '@edx/frontend-platform/react';
import { getEnrolledCourseRunDetails, getNotStartedCourseDetails } from './data/utils';
import { NotCurrentlyAvailable } from './data/constants';

const ProgramProgressCourses = ({ courseData }) => {
  const { enterpriseConfig } = useContext(AppContext);
  let coursesCompleted = [];
  let coursesInProgress = [];
  let coursesNotStarted = [];
  const courseAboutPageURL = (key) => `/${enterpriseConfig.slug}/course/${key}`;

  if (courseData?.completed) {
    coursesCompleted = getEnrolledCourseRunDetails(courseData.completed);
  }
  if (courseData?.inProgress) {
    coursesInProgress = getEnrolledCourseRunDetails(courseData.inProgress);
  }
  if (courseData?.notStarted) {
    coursesNotStarted = getNotStartedCourseDetails(courseData.notStarted);
  }
  const { courseWithMultipleCourseRun, courseWithSingleCourseRun } = coursesNotStarted;

  const renderCertificatePurchased = () => (
    <Row className="d-flex align-items-start py-3 pt-5">
      <Col className="d-flex align-items-center">
        <span>Certificate Status: </span>
        <CheckCircle className="fa fa-check-circle circle-color" />
        <span>Certificate Purchased</span>
      </Col>
    </Row>
  );
  return (
    <div className="col-10 p-0">
      {coursesInProgress?.length > 0
      && (
        <div className="mb-5">
          <h4>COURSES IN PROGRESS {coursesInProgress.length}</h4>
          <hr />
          <div className="courses">
            {coursesInProgress.map((course) => (
              (
                <div className="mt-4.5 pl-3 pb-5 pr-3" key={course.key}>
                  <h4 className="text-dark-500">{course.title}</h4>
                  <p className="text-gray-500 text-capitalize mt-1">Enrolled:
                    ({course?.pacingType.replace('_', '-')}) Started {moment(course.start)
                    .format('MMMM Do, YYYY')}
                  </p>
                  <a
                    className="btn btn-outline-primary btn-xs-block float-right mb-4 mt-4"
                    href={courseAboutPageURL(course.key)}
                  >
                    {course.isEnded ? 'View Archived Course' : 'View Course'}
                  </a>
                  {course.certificateUrl
                && renderCertificatePurchased()}
                </div>
              )
            ))}
          </div>
        </div>
      )}
      {courseData?.notStarted?.length > 0
      && (
        <div className="mb-5 courses">
          <h4> REMAINING COURSES {courseData?.notStarted?.length}</h4>
          <hr />
          {courseWithSingleCourseRun.map((course) => (
            (
              <div className="mt-4.5 pl-3 pb-5 pr-3" key={course.key}>
                <h4 className="text-dark-500">{course.title}</h4>
                {course.isEnrollable
                  ? (
                    <>
                      <p className="text-gray-500 text-capitalize mt-1">
                        ({course?.pacingType.replace('_', '-')}) Starts {moment(course.start)
                          .format('MMMM Do, YYYY')}
                      </p>
                      <a
                        className="btn btn-outline-primary btn-xs-block mt-2 float-right"
                        href={courseAboutPageURL(course.key)}
                      >
                        Enroll Now
                      </a>
                    </>
                  )
                  : (
                    <p
                      className=" mt-2 float-right"
                    >
                      {NotCurrentlyAvailable}
                    </p>
                  )}
              </div>
            )
          ))}

          {courseWithMultipleCourseRun.map((course) => (
            (
              <div className="mt-4.5 pl-3 pb-5 pr-3" key={course.key}>
                <h4 className="text-dark-500">{course.title}</h4>
                {course.isEnrollable
                  ? (
                    <>
                      <p className="text-gray-500 text-capitalize mt-1">
                        {course.courseRunDate?.length > 1
                          ? (
                            <Form.Group className="pr-0" as={Col} controlId="formGridState-2">
                              <Form.Label>Your available sessions:</Form.Label>
                              <Form.Control as="select">
                                {course.courseRunDate.map(cRunDate => (
                                  <option>{cRunDate}</option>
                                ))}
                              </Form.Control>
                            </Form.Group>
                          )
                          : (
                            <span data-testid="course-run-single-date">
                              ({course?.pacingType.replace('_', '-')}) Starts {moment(course.start)
                                .format('MMMM Do, YYYY')}
                            </span>
                          )}
                      </p>
                      <a
                        className="btn btn-outline-primary btn-xs-block mt-2 float-right"
                        href={courseAboutPageURL(course.key)}
                      >
                        Learn More
                      </a>
                    </>
                  )
                  : (
                    <p className="mt-2 float-right">
                      {NotCurrentlyAvailable}
                    </p>
                  )}
              </div>
            )
          ))}
        </div>
      )}
      {coursesCompleted?.length > 0
      && (
        <div className="mb-6 courses">
          <h4> COURSES COMPLETED {coursesCompleted.length}</h4>
          <hr />
          {coursesCompleted.map((course) => (
            (
              <div className="mt-4.5 pl-3 pb-5 pr-3" key={course.key}>
                <h4 className="text-dark-500">{course.title}</h4>
                <p className="text-gray-500 text-capitalize mt-1">
                  ({course?.pacingType.replace('_', '-')}) Started {moment(course.start)
                    .format('MMMM Do, YYYY')}
                </p>
                <a
                  className="btn btn-outline-primary btn-xs-block mb-6 float-right"
                  href={courseAboutPageURL(course.key)}
                >
                  View Course
                </a>

                {course.certificateUrl
                && renderCertificatePurchased()}
              </div>
            )
          ))}
        </div>
      )}
    </div>

  );
};
ProgramProgressCourses.propTypes = {
  courseData: PropTypes.shape([]).isRequired,
};
export default ProgramProgressCourses;