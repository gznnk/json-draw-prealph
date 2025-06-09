export default {
	forbidden: [
		{
			name: "no-circular",
			severity: "error",
			comment: "Avoid circular dependencies",
			from: {},
			to: {
				circular: true,
			},
		},
	],
};
