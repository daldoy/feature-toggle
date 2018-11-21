import React, { Component } from 'react';

import styles from './EmailsTable.module.css';

class EmailsTable extends Component {
	state = {
		newEmail: '',
	};

	confirm = () => {
		if (this.testEmail(this.state.newEmail)) {
			this.props.addEmail(this.state.newEmail.trim());
			this.setState({ newEmail: '' });
			window.scrollTo(0, document.body.scrollHeight);
		}
	};

	inputChange = event => {
		this.setState({ [event.target.name]: event.target.value });
	};

	onKeyDown = event => {
		if (event.key === 'Enter') {
			if (event.target.name === 'word') {
				if (this.state.word !== '') {
					this.descriptionInput.focus();
				}
			} else {
				this.confirm();
			}
		}
	};

	testEmail = email => {
		return /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(email);
	};

	render() {
		return (
			<div className={styles.FeaturesTable}>
				<div className={styles.RowWrapper}>
					<div className={styles.FeatureRow}>
						<div className={styles.Column}>Emails</div>
					</div>
				</div>

				{this.props.emails.map((email, idx) => (
					<div key={idx} className={styles.RowWrapper}>
						<div className={styles.Row}>
							<div className={styles.Column}>{email}</div>
							{email !== 'admin@admin.com' && (
								<div className={styles.RemoveBtn} onClick={() => this.props.removeEmail(email)} />
							)}
						</div>
					</div>
				))}
				<div className={styles.RowWrapper}>
					<div className={styles.FeatureRow}>Add email:</div>
				</div>
				<div className={styles.RowWrapper}>
					<div className={styles.Row}>
						<div className={styles.Column}>
							<input
								name="newEmail"
								value={this.state.newEmail}
								onKeyDown={e => this.onKeyDown(e, true)}
								onChange={this.inputChange}
								className={styles.Input}
							/>
						</div>
						<div>
							{this.testEmail(this.state.newEmail) && (
								<div className={styles.ConfirmIcon} onClick={this.confirm} />
							)}
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default EmailsTable;
